import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject, Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import MapOptions = google.maps.MapOptions;
import LatLngLiteral = google.maps.LatLngLiteral;
import { GoogleMap } from "@angular/google-maps";
import ControlPosition = google.maps.ControlPosition;
import { BehaviorSubject, bufferTime, tap } from "rxjs";
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";

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
export class PlaceSelectorComponent extends BaseFormControlComponent<PlaceSelectorData> implements OnInit, AfterViewInit, OnDestroy {
  protected readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('currentLocation', { read: ElementRef }) currentLocation!: ElementRef;

  @Input() initialPlaceSelectorData?: PlaceSelectorData;

  markerPosition$: BehaviorSubject<LatLngLiteral> = new BehaviorSubject<google.maps.LatLngLiteral>({ lat: 48.69083, lng: 9.1405 });
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
    if (this.initialPlaceSelectorData?.markerPosition) {
      this.markerPosition$.next(this.initialPlaceSelectorData.markerPosition);
      this.setMapZoomAndPosition(18, this.initialPlaceSelectorData.markerPosition.lat, this.initialPlaceSelectorData.markerPosition.lng);
    } else {
      this.showCurrentLocation();
    }

    this.markerPosition$
      .pipe(
        bufferTime(5000),
        tap(() => {
          this.handleModelChange({
            markerPosition: this.markerPosition$.getValue(),
            writtenPosition: '123123'
          });
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
    this.markerPosition$.next({
      lat: latitude,
      lng: longitude
    });
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.markerPosition$.complete();
  }
}
