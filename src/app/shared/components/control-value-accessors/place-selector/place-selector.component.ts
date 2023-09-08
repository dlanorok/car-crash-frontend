import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject, OnInit,
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
import { Option } from "@app/home/pages/crash/flow.definition";

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
  step = 0;
  options: Option[] = [
    {
      value: 'yes',
      label: 'yes'
    },
    {
      value: 'no',
      label: 'no'
    },
  ];
  atPlace: 'yes' | 'no' | null = null;
  protected readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild('currentLocation', { read: ElementRef }) currentLocation!: ElementRef;
  @ViewChild('confirmLocationBtn', { read: ElementRef }) confirmLocationBtn!: ElementRef;
  @ViewChild('searchPlaceInput', { read: ElementRef }) searchPlaceInput!: ElementRef;

  // set setSearchPlaceInput(searchPlaceInput: ElementRef<HTMLInputElement>) {
  //   if (searchPlaceInput) {
  //     const searchBox = new google.maps.places.SearchBox(searchPlaceInput.nativeElement);
  //     searchBox.addListener('places_changed', () => {
  //       const places = searchBox.getPlaces();
  //
  //       if (!places || (places || []).length == 0) {
  //         return;
  //       }
  //
  //       const location = places[0].geometry?.location;
  //       if (location) {
  //         this.map.googleMap?.setCenter(location);
  //       }
  //     });
  //   }
  // }


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
            this.map.googleMap.controls[ControlPosition.BOTTOM_CENTER].push(this.confirmLocationBtn.nativeElement);
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
          this.atPlace = 'no';
          console.error('Error getting current location:', error);
        }
      );
    } else {
      const text = document.createTextNode("NOT SUPPORTED");
      paragraph?.appendChild(text);
      this.atPlace = 'no';
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
        at_place: this.atPlace,
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
    if (!value) {
      this.showCurrentLocation();
    } else {
      this.setMapZoomAndPosition(18, value.marker_position!.lat, value.marker_position!.lng);
    }
  }

  beforeSubmit(): Observable<boolean> {
    return of(undefined).pipe(
      map(() => {
        return this.step > 0;
      }),
      tap(() => {
        if (this.step === 0) {
          this.step += 1;
          this.askForCurrentLocation();
        }
      })
    );
  }

  beforeBack(): Observable<boolean> {
    return of(undefined).pipe(
      map(() => this.step < 1),
      tap(() => {
        if (this.step > 0) {
          this.step -= 1;
        }
      })
    );
  }

  handleSelectChange(value: 'yes' | 'no'): void {
    this.beforeSubmit().pipe(take(1)).subscribe();
    this.atPlace = value;
  }
}
