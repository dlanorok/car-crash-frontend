import {
  AfterViewInit,
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
import { filter, take, tap } from "rxjs";

export interface PlaceSelectorData {
  markerPosition?: LatLngLiteral;
  writtenPosition?: string;
}

@Component({
  selector: 'app-place-selector',
  templateUrl: './place-selector.component.html',
  styleUrls: ['./place-selector.component.scss'],
  providers: [provideControlValueAccessor(PlaceSelectorComponent)],
})
export class PlaceSelectorComponent extends BaseFormControlComponent<PlaceSelectorData> implements OnInit, AfterViewInit {
  protected readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('currentLocation', { read: ElementRef }) currentLocation!: ElementRef;

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

  ngOnInit() : void {
    this.value$.pipe(
      filter((value) => value !== undefined),
      take(1),
      tap((value) => {
        if (!value) {
          this.showCurrentLocation();
        } else {
          this.setMapZoomAndPosition(18, value.markerPosition!.lat, value.markerPosition!.lng);
        }
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    if (this.map.googleMap) {
      this.map.googleMap.controls[ControlPosition.TOP_CENTER].push(this.currentLocation.nativeElement);
    }
    this.addMapCenterChangeListener();
  }

  private setMapZoomAndPosition(zoom: number, lat: number, lng: number) {
    if (this.map?.googleMap) {
      this.map.googleMap.setCenter({lat: lat, lng: lng});
      this.map.googleMap.setZoom(zoom);
    }
    this.mapOptions.center = {lat: lat, lng: lng};
    this.mapOptions.zoom = zoom;
  }

  showCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setMapZoomAndPosition(18, latitude, longitude);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
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

  private updateMarkerPosition(latitude: number, longitude: number) {
    this.handleModelChange(
      {
        ...this.value$.getValue(),
        markerPosition: {
          lat: latitude,
          lng: longitude
        }
      }
    );
    this.changeDetectorRef.detectChanges();
  }
}
