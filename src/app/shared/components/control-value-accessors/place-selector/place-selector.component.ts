import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import MapOptions = google.maps.MapOptions;
import LatLngLiteral = google.maps.LatLngLiteral;
import { GoogleMap } from "@angular/google-maps";
import ControlPosition = google.maps.ControlPosition;
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { distinctUntilChanged, filter, take, tap } from "rxjs";

export interface PlaceSelectorData {
  marker_position?: LatLngLiteral;
  written_position?: string;
}

@Component({
  selector: 'app-place-selector',
  templateUrl: './place-selector.component.html',
  styleUrls: ['./place-selector.component.scss'],
  providers: [provideControlValueAccessor(PlaceSelectorComponent)],
})
export class PlaceSelectorComponent extends BaseFormControlComponent<PlaceSelectorData> implements OnInit, AfterViewChecked {
  protected readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild('currentLocation', { read: ElementRef }) currentLocation!: ElementRef;
  @ViewChild('confirmLocationBtn', { read: ElementRef }) confirmLocationBtn!: ElementRef;

  mapOptions: MapOptions = {
    zoom: 5,
    mapTypeId: "satellite",
    clickableIcons: false,
    streetViewControl: false,
    fullscreenControl: false,
    tilt: 0,
    rotateControl: false,
    mapTypeControlOptions: { mapTypeIds: [] },
  };

  initialized = false;

  position?: LatLngLiteral;

  ngOnInit() : void {
    this.value$.pipe(
      filter((value) => value !== undefined),
      take(1),
      tap((value) => {
        if (!value) {
          this.showCurrentLocation();
        } else {
          this.setMapZoomAndPosition(18, value.marker_position!.lat, value.marker_position!.lng);
        }
      })
    ).subscribe();
  }

  ngAfterViewChecked() {
    if (this.map && !this.initialized) {
      this.initialized = true;
      this.isDisabled$.pipe(
        distinctUntilChanged(),
        tap((isDisabled) => {
          if (isDisabled) {
            this.removeMapCenterListeners();
            if (this.map.googleMap) {
              this.map.googleMap.setOptions({draggable: false});
            }
            return;
          }

          if (this.map.googleMap) {
            this.map.googleMap.controls[ControlPosition.TOP_CENTER].push(this.currentLocation.nativeElement);
            this.map.googleMap.controls[ControlPosition.TOP_CENTER].push(this.confirmLocationBtn.nativeElement);
            this.map.googleMap.setOptions({draggable: true});
          }
          this.addMapCenterChangeListener();
        })
      ).subscribe();
    }
  }

  private setMapZoomAndPosition(zoom: number, lat: number, lng: number) {
    if (this.map?.googleMap) {
      this.map.googleMap.setCenter({lat: lat, lng: lng});
      this.map.googleMap.setZoom(zoom);
    }
    this.mapOptions.center = {lat: lat, lng: lng};
    this.mapOptions.zoom = zoom;
    this.position = {lat: lat, lng: lng};
  }

  showCurrentLocation() {
    const paragraph = document.getElementById("test");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setMapZoomAndPosition(18, latitude, longitude);
          const text = document.createTextNode("SUCCESS");
          paragraph?.appendChild(text);
        },
        (error) => {
          const text = document.createTextNode(error.message);
          paragraph?.appendChild(text);
          const text1 = document.createTextNode(error.code.toString());
          paragraph?.appendChild(text1);
          console.error('Error getting current location:', error);
        }
      );
    } else {
      const text = document.createTextNode("NOT SUPPORTED");
      paragraph?.appendChild(text);
      console.error('Geolocation is not supported by this browser.');
    }
  }

  confirmLocation() {
    const value = this.value$.getValue();
    if (value) {
      value.marker_position = this.position;
      value.written_position = '';
      this.handleModelChange(value);
    } else {
      this.handleModelChange({
        marker_position: this.position,
        written_position: ''
      });
    }

  }

  private addMapCenterChangeListener() {
    // Add event listener to update marker position when the map center changes
    if (this.map?.googleMap) {
      this.map.googleMap.addListener('center_changed', () => {
        const center = this.map.getCenter();
        if (center) {
          this.updateMarkerPosition(center.lat(), center.lng());
        }
      });
    }
  }

  private removeMapCenterListeners() {
    if (this.map?.googleMap) {
      google.maps.event.clearListeners(this.map.googleMap, 'center_changed');
    }
  }

  private updateMarkerPosition(latitude: number, longitude: number) {
    this.position = {
      lat: latitude,
      lng: longitude
    };
    this.changeDetectorRef.detectChanges();
  }
}
