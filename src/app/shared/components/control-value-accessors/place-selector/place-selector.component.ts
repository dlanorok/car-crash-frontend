import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject, Input, OnInit,
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
import { distinctUntilChanged, Observable, of, switchMap, take, tap } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Location } from "@angular/common";
import { Step } from "@app/home/pages/crash/flow.definition";

export interface PlaceSelectorData {
  at_place: 'yes' | 'no' | null;
  marker_position?: LatLngLiteral;
}

@Component({
  selector: 'app-place-selector',
  templateUrl: './place-selector.component.html',
  styleUrls: ['./place-selector.component.scss'],
  providers: [provideControlValueAccessor(PlaceSelectorComponent)],
})
export class PlaceSelectorComponent extends BaseFormControlComponent<PlaceSelectorData> implements AfterViewChecked, OnInit {
  protected readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected readonly location: Location = inject(Location);

  @Input() step!: Step;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild('currentLocation', { read: ElementRef }) currentLocation!: ElementRef;
  @ViewChild('searchPlaceInput', { read: ElementRef }) searchPlaceInput!: ElementRef;


  mapOptions: MapOptions = {
    zoom: 5,
    mapTypeId: "satellite",
    clickableIcons: false,
    streetViewControl: false,
    fullscreenControl: false,
    tilt: 0,
    rotateControl: false,
    zoomControl: false,
    mapTypeControlOptions: { mapTypeIds: [] },
  };

  initialized = false;

  position?: LatLngLiteral;

  ngOnInit() : void {
    this.value$.pipe(
      filter((value) => value !== undefined),
      take(1),
      switchMap((value) => {
        if (value?.at_place) {
          return this.beforeSubmit();
        }
        return of(undefined);
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
            this.map.googleMap.controls[ControlPosition.TOP_CENTER].push(this.searchPlaceInput.nativeElement);
            this.map.googleMap.controls[ControlPosition.RIGHT_BOTTOM].push(this.currentLocation.nativeElement);
            const searchBox = new google.maps.places.SearchBox(this.searchPlaceInput.nativeElement);
            searchBox.addListener('places_changed', () => {
              const places = searchBox.getPlaces();

              if (!places || (places || []).length == 0) {
                return;
              }

              const location = places[0].geometry?.location;
              if (location) {
                this.map.googleMap?.setCenter(location);
                this.map.googleMap?.setZoom(18);
              }
            });
            this.map.googleMap.setOptions({draggable: true});
          }
          this.addMapCenterChangeListener();
          this.askForCurrentLocation();
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


  zoom(zoomIn: boolean): void {
    if (this.map.googleMap) {
      let currentZoom = this.map.googleMap.getZoom() || 18;
      this.map.googleMap.setZoom(zoomIn ? ++currentZoom : --currentZoom);
    }
  }

  showCurrentLocation() {
    const div = document.getElementById('test');
    if (!div) {
      return;
    }

    div.innerHTML += "ASKED";
    if (navigator.geolocation) {
      div.innerHTML += "Get current position";
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setMapZoomAndPosition(18, latitude, longitude);
        },
        (error) => {
          div.innerHTML += `Error: ${JSON.stringify(error)}`;
          console.error('Error getting current location:', error);
        }
      );
    } else {
      div.innerHTML += `Error udnefined`;
      console.error('Geolocation is not supported by this browser.');
    }
  }

  confirmLocation() {
    const value = this.value$.getValue();
    if (value) {
      value.marker_position = this.position;
      this.handleModelChange(value);
    } else {
      this.handleModelChange({
        at_place: null,
        marker_position: this.position,
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

  private askForCurrentLocation() {
    const value = this.value$.getValue();
    if (!value?.marker_position) {
      this.showCurrentLocation();
    } else {
      this.setMapZoomAndPosition(18, value.marker_position.lat, value.marker_position.lng);
    }
  }

  beforeSubmit(): Observable<boolean> {
    return of(undefined).pipe(
      tap(() => {
        this.confirmLocation();
      }),
      map(() => true)
    );
  }

  onSubmit() {
    this.beforeSubmit().pipe(take(1)).subscribe();
  }

  onBack() {
    this.location.back();
  }

  handleSelectChange(value: 'yes' | 'no'): void {
    const placeLocation = this.value$.getValue();
    if (placeLocation) {
      placeLocation.at_place = value;
      this.writeValue(placeLocation);
    } else {
      this.writeValue({
        at_place: value,
        marker_position: this.position,
      });
    }
  }
}
