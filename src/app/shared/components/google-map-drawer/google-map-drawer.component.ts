import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { GoogleMap } from "@angular/google-maps";
import {
  combineLatest, distinctUntilChanged,
  filter,
  map,
  mergeMap,
  Observable, publishReplay, refCount,
  ReplaySubject,
  Subscription,
  switchMap,
  take,
  tap,
  timer
} from "rxjs";
import { Store } from "@ngrx/store";
import { CarOverlay } from "@app/shared/common/non-scaling-marker";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { CrashModel } from "@app/shared/models/crash.model";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { Router } from "@angular/router";
import { EventType, SpecialModelName, WebSocketService } from "@app/shared/services/web-socket.service";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { PolygonsData, SketchCarModel, SketchModel } from "@app/shared/models/sketch.model";
import { SketchesApiService } from "@app/shared/api/sketches/sketches-api.service";
import MapOptions = google.maps.MapOptions;
import LatLngLiteral = google.maps.LatLngLiteral;
import ControlPosition = google.maps.ControlPosition;

@Component({
  selector: 'app-google-map-drawer',
  templateUrl: './google-map-drawer.component.html',
  styleUrls: ['./google-map-drawer.component.scss']
})
export class GoogleMapDrawerComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly router: Router = inject(Router);
  protected readonly store: Store = inject(Store);
  protected readonly webSocketService: WebSocketService = inject(WebSocketService);
  protected readonly cookieService: CookieService = inject(CookieService);
  protected readonly sketchApiService: SketchesApiService = inject(SketchesApiService);

  readonly sketch$: ReplaySubject<SketchModel> = new ReplaySubject<SketchModel>(1);

  @Input() set sketch(sketchModel: SketchModel) {
    this.sketch$.next(sketchModel);
  }

  @HostListener('window:keydown',['$event'])
  onKeyPress($event: KeyboardEvent) {
    if(($event.ctrlKey || $event.metaKey) && $event.key == 'z') {
      const polyline = this.polyLines.pop();
      if (polyline) {
        polyline.setMap(null);
      }
    }
  }

  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('drawingButton') drawingButton!: ElementRef<HTMLDivElement>;
  @ViewChild('drawCarsButton') drawCarsButton!: ElementRef<HTMLDivElement>;
  @ViewChild('undoButton') undoButton!: ElementRef<HTMLDivElement>;

  rotation = 0;
  mapOptions: MapOptions = {};
  initialPosition?: LatLngLiteral;

  moveListener: any;
  touchListener: any;
  drawingEnabled = false;
  drawing = false;
  currentPolyLine: google.maps.Polyline = new google.maps.Polyline({});
  polyLines: google.maps.Polyline[] = [];
  carMarkers: { [key: string]: CarOverlay } = {};
  previousCarMarkers: { [key: string]: {rotation: number, bounds: google.maps.LatLngBounds} } = {};

  crash$: Observable<CrashModel> = this.store.select(selectCrash);

  anonymousSubscriptions: Subscription[] = [];

  readonly isCreator$ = this.sketch$.pipe(
    filter((sketch: SketchModel) => !!sketch),
    map((sketch: SketchModel) => {
      return this.cookieService.get(CookieName.sessionId) === sketch.creator;
    }),
    publishReplay(1),
    refCount()
  );

  ngOnInit(): void {
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.setInitialMapPosition();
  }

  ngAfterViewInit() {
    this.setMapControls();
    this.listenToSketchChanges();
    this.sendUpdateSocketsIfCreator();
    this.updateSketchIfCreator();
  }

  private updateSketchIfCreator() {
    this.anonymousSubscriptions.push(this.isCreator$
      .pipe(
        filter((isCreator) => isCreator),
        switchMap(() => {
          return combineLatest([
            this.sketch$,
            timer(1000, 5000)
          ]);
        }),
        map(([sketch, _]) => {
          const updateSketch = new SketchModel({...sketch});
          if (Object.keys(this.carMarkers).length > 0) {
            const newSketchCars = [];
            for (const key of Object.keys(this.carMarkers)) {
              const carMarker = this.carMarkers[key];
              newSketchCars.push(carMarker.getSketchCarModel());
            }
            updateSketch.sketch_cars = newSketchCars;
          }

          const polygons: PolygonsData = {
            sketch_id: updateSketch.id,
            polygons: this.polyLines.map((polyLine) => {
              return polyLine.getPath().getArray();
            })
          };

          updateSketch.polygons = JSON.stringify(polygons);
          return updateSketch;
        }),
        mergeMap((sketch) => {
          return this.sketchApiService.patch(sketch);
        })
      ).subscribe());
  }

  private sendUpdateSocketsIfCreator() {
    this.anonymousSubscriptions.push(this.isCreator$
      .pipe(
        filter((isCreator) => isCreator),
        switchMap(() => combineLatest([
          timer(1000, 100),
          this.sketch$
        ])),
        tap(([_, sketch]: [any, SketchModel]) => {
          for (const key of Object.keys(this.carMarkers)) {
            const carMarker = this.carMarkers[key];
            if (!carMarker.carId || !carMarker.shouldSave) {
              continue;
            }
            carMarker.shouldSave = false;
            this.webSocketService.send({
              model: carMarker.getSketchCarModel(sketch.id),
              type: EventType.modelUpdated,
              sender_id: this.cookieService.get(CookieName.sessionId),
              model_name: SpecialModelName.SketchCarUpdated
            });
            if (carMarker.carId) {
              this.previousCarMarkers[carMarker.carId] = {
                bounds: carMarker.bounds_,
                rotation: carMarker.rotation
              };
            }
          }
        })
      ).subscribe());
  }

  private listenToSketchChanges() {
    this.anonymousSubscriptions.push(this.sketch$.pipe(
      tap((sketch: SketchModel) => {
        // Draw or update cars
        if (sketch.sketch_cars.length > 0) {
          sketch.sketch_cars.forEach((sketch_car: SketchCarModel, i) => {
            const bounds = new google.maps.LatLngBounds({
              east: sketch_car.position_east || 0,
              west: sketch_car.position_west || 0,
              north: sketch_car.position_north || 0,
              south: sketch_car.position_south || 0
            });

            if (!(sketch_car.car_id in this.carMarkers)) {
              const overlay = new CarOverlay(bounds, sketch_car.car_id, sketch_car.rotation, i + 1, sketch.creator === this.cookieService.get(CookieName.sessionId));
              if (this.map.googleMap) {
                overlay.setMap(this.map.googleMap);
              }
              this.carMarkers[sketch_car.car_id] = overlay;
            } else {
              this.carMarkers[sketch_car.car_id].rotate(sketch_car.rotation || 0);
              this.carMarkers[sketch_car.car_id].bounds_ = bounds;
              this.carMarkers[sketch_car.car_id].draw();
            }
          });
        }

        // Redraw polygons
        const polygons = JSON.parse(sketch.polygons) as PolygonsData;
        if (polygons && Array.isArray(polygons.polygons)) {
          this.polyLines.map((polyline) => polyline.setMap(null));
          this.polyLines = [];
          polygons.polygons.forEach((polygon: any[]) => {
            const polyLine =  new google.maps.Polyline({
              map: this.map.googleMap,
              clickable: false,
              path: polygon.map(polyline => new google.maps.LatLng(polyline))
            });
            this.polyLines.push(polyLine);
            return polyLine;
          });
        }
      })
    ).subscribe());
  }

  private setMapControls() {
    this.anonymousSubscriptions.push(this.isCreator$.pipe(
      distinctUntilChanged(),
      tap((isCreator) => {
        if (this.map.googleMap && isCreator) {
          this.map.googleMap.controls[ControlPosition.TOP_CENTER].push(this.undoButton.nativeElement);
          this.map.googleMap.controls[ControlPosition.TOP_CENTER].push(this.drawingButton.nativeElement);
          this.map.googleMap.controls[ControlPosition.TOP_CENTER].push(this.drawCarsButton.nativeElement);
        }
      })
    ).subscribe());
  }

  private setInitialMapPosition() {
    this.mapOptions = {
      zoom: 8,
      center: this.initialPosition,
      mapTypeId: "satellite",
      clickableIcons: false,
      streetViewControl: false,
      fullscreenControl: false,
      tilt: 0,
      rotateControl: false,
      mapTypeControlOptions: { mapTypeIds: [] },
    };


    combineLatest([this.sketch$, this.isCreator$]).pipe(
      filter(([sketch, isCreator]: [SketchModel, boolean]) => !!sketch),
      take(1),
      /**
       * if already drawn set on car[0] else if creator, ask for location
       */
      tap(([sketch, isCreator]: [SketchModel, boolean]) => {
        let initialPosition: LatLngLiteral = {lat: 50.073658, lng: 14.418540};
        let initialZoom = 5;
        if (sketch.sketch_cars.length > 0) {
          const car = sketch.sketch_cars[0];
          initialPosition = { lat: car.position_south, lng: car.position_west};
          initialZoom = 18;
        } else {
          if (isCreator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const {latitude, longitude} = position.coords;
              initialPosition = {lat: latitude, lng: longitude};
              initialZoom = 18;
              this.setMapZoomAndPosition(initialZoom, initialPosition);

            }, (error) => {
              console.log('Error getting current location:', error);
            });
          }
        }
        this.setMapZoomAndPosition(initialZoom, initialPosition);
      })
    ).subscribe();
  }

  private setMapZoomAndPosition(zoom: number, position: LatLngLiteral) {
    this.initialPosition = position;
    if (this.map?.googleMap) {
      this.map.googleMap.setCenter(this.initialPosition);
      this.map.googleMap.setZoom(zoom);
    }
    this.mapOptions.center = this.initialPosition;
    this.mapOptions.zoom = zoom;
  }

  toggleDraw($event: MouseEvent) {
    $event.stopPropagation();
    this.drawingEnabled = !this.drawingEnabled;
  }

  undoDraw($event: MouseEvent) {
    $event.stopPropagation();
    this.drawingEnabled = false;
    this.drawing = false;
    const polyline = this.polyLines.pop();
    if (polyline) {
      polyline.setMap(null);
    }
    this.sendPolygonsUpdateWS();
  }

  drawCars($event: MouseEvent) {
    $event.stopPropagation();
    this.drawingEnabled = false;
    this.drawing = false;
    this.crash$
      .pipe(
        tap((crash: CrashModel) => {
          for(let i = Object.values(this.carMarkers).length; i < crash.participants; i++) {
            const center = this.map.googleMap?.getCenter();
            if (!center) {
              return;
            }
            const bounds1 = new google.maps.LatLng(center?.lat(), center?.lng());
            const bounds2 = new google.maps.LatLng(bounds1?.lat() + 0.00003, bounds1?.lng() + 0.0001);
            const bounds = new google.maps.LatLngBounds(
              bounds1,
              bounds2
            );
            const overlay = new CarOverlay(bounds, crash.cars?.[i] || 0, 0, i + 1, true);
            if (this.map.googleMap) {
              overlay.setMap(this.map.googleMap);
            }
            this.carMarkers[overlay.carId] = overlay;
          }
        }),
        take(1)
      ).subscribe();
  }

  drawFreeHand($event: MouseEvent | TouchEvent) {
    $event.stopPropagation();
    if (!this.map.googleMap || !this.drawingEnabled) {
      return;
    }
    this.disable();

    this.currentPolyLine = new google.maps.Polyline({
      map: this.map.googleMap,
      clickable: false
    });

    this.drawing = true;
    this.moveListener = google.maps.event.addListener(this.map.googleMap, 'mousemove', this.mouseMoveHandler.bind(this));
    this.touchListener = google.maps.event.addListener(this.map.googleMap, 'touchmove', this.mouseMoveHandler.bind(this));

    google.maps.event.addListenerOnce(this.map.googleMap, 'mouseup', this.mouseUpHandler.bind(this));
    google.maps.event.addListenerOnce(this.map.googleMap, 'touchend', this.mouseUpHandler.bind(this));
  }

  mouseMoveHandler(event: any) {
    if (this.drawingEnabled && this.drawing) {
      this.currentPolyLine.getPath().push(event.latLng);
    }
  }

  mouseUpHandler() {
    google.maps.event.removeListener(this.moveListener);
    google.maps.event.removeListener(this.touchListener);
    this.polyLines.push(this.currentPolyLine);
    this.sendPolygonsUpdateWS();
    this.drawing = false;
    this.enable();
  }

  enable() {
    if (!this.map.googleMap) {
      return;
    }

    this.map.googleMap.setOptions({
      draggable: true,
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: true
    });
  }

  disable() {
    if (!this.map.googleMap) {
      return;
    }

    this.map.googleMap.setOptions({
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false
    });
  }

  private sendPolygonsUpdateWS() {
    this.sketch$
      .pipe(
        take(1),
        tap((sketch) => {
          this.webSocketService.send({
            model: JSON.stringify({
              polygons: this.polyLines.map(polyline => polyline.getPath().getArray()),
              sketch_id: sketch.id
            } as PolygonsData),
            type: EventType.modelUpdated,
            sender_id: this.cookieService.get(CookieName.sessionId),
            model_name: SpecialModelName.SketchPolygonsUpdated
          });
        })
      ).subscribe();
  }

  ngOnDestroy() {
    this.anonymousSubscriptions.map(sub => sub.unsubscribe());
  }

}


