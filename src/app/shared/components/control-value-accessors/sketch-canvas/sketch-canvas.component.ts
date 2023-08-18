import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { PlaceSelectorData } from "@app/shared/components/control-value-accessors/place-selector/place-selector.component";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import {
  filter,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  takeUntil,
  tap,
  combineLatest,
  fromEvent
} from "rxjs";
import { Step } from "@app/home/pages/crash/flow.definition";
import { map } from "rxjs/operators";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import LatLngLiteral = google.maps.LatLngLiteral;
import { environment } from "../../../../../environments/environment";
import Konva from "konva";
import Vector2d = Konva.Vector2d;
import { KonvaEventObject } from "konva/lib/Node";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { CanEditSketchPipe } from "@app/shared/components/control-value-accessors/sketch-canvas/can-edit-sketch.pipe";
import { CanConfirmSketchPipe } from "@app/shared/components/control-value-accessors/sketch-canvas/can-confirm-sketch.pipe";

export interface Sketch {
  cars: CarData[];
  editor: string;
  editing: boolean;
  confirmedEditors: string[];
}

interface CarData {
  id: string;
  scaleY: number;
  scaleX: number;
  x: number;
  y: number;
  rotation: number;
}

interface PointData {
  x: number;
  y: number
}

const imageWidth = 1000;
const imageHeight = 1000;

@Component({
  selector: 'app-sketch-canvas',
  templateUrl: './sketch-canvas.component.html',
  styleUrls: ['./sketch-canvas.component.scss'],
  providers: [provideControlValueAccessor(SketchCanvasComponent)],
})
export class SketchCanvasComponent extends BaseFormControlComponent<Sketch> implements AfterViewInit, OnDestroy {
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly canEditSketch: CanEditSketchPipe = inject(CanEditSketchPipe);
  private readonly canConfirmSketch: CanConfirmSketchPipe = inject(CanConfirmSketchPipe);

  @ViewChild('container', { static: true }) container!: ElementRef;
  private stage!: Konva.Stage;
  layer!: Konva.Layer;
  image!: Konva.Image;
  tr!: Konva.Transformer;
  cars: Konva.Image[] = [];
  private lastCenter: PointData | null = null;
  private lastDist = 0;
  private isDragging = false;

  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly step$: ReplaySubject<Step> = new ReplaySubject<Step>();

  @Input() set step(step: Step) {
    this.step$.next(step);
  }

  readonly positionData$: Observable<PlaceSelectorData | undefined> = this.step$.pipe(
    switchMap((step) => {
      if (step && step.data_from_input) {
        return this.questionnaireService.getOrFetchQuestionnaires().pipe(
          map(
            (questionnaires: QuestionnaireModel[]) => questionnaires[0].data.inputs.find(input => input.id === step.data_from_input)?.value
          ),
        );
      }
      return of(undefined);
    })
  );

  readonly imageUrl$: Observable<string> = this.positionData$.pipe(
    map((positionData) => positionData?.markerPosition),
    filter((markerPosition: LatLngLiteral | undefined): markerPosition is LatLngLiteral => !!markerPosition),
    map((markerPosition: LatLngLiteral) => {
      const imageSize = `${imageWidth}x${imageHeight}`;
      return `${environment.googleApiUrl}/staticmap?center=${markerPosition?.lat},${markerPosition.lng}&zoom=18&size=${imageSize}&key=${environment.googleApiKey}&scale=2&maptype=satellite`;
    }),
  );

  ngAfterViewInit(): void {
    this.setStageAndLayer();
    this.drawGoogleImageAndAddCars();
    window.addEventListener('touchend', this.onTouchEnd.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this));
    this.layer.on("click tap", this.onClick.bind(this));
  }

  private setStageAndLayer() {
    this.stage = new Konva.Stage({
      container: this.container.nativeElement,
      width: this.container.nativeElement.clientWidth,
      height: this.container.nativeElement.clientHeight ,
    });
    this.layer = new Konva.Layer({
      draggable: true,
      dragBoundFunc: this.dragBoundFunc,
    });
    this.stage.add(this.layer);
  }

  private drawGoogleImageAndAddCars(): void {
    this.imageUrl$.pipe(
      takeUntil(this.destroy$),
      switchMap((imageUrl: string) => {
        const initialScale = 2;
        if (this.image) {
          return of(initialScale);
        }

        const image = new Image();
        image.src = imageUrl;
        image.crossOrigin = "Anonymous";
        return fromEvent(image, 'load').pipe(
          tap(() => {
            this.image = new Konva.Image({
              image: image,
              width: image.width,
              height: image.height,
            });
            this.layer.add(this.image);
            this.layer.draw();
          }),
          map(() => {
            this.tr = new Konva.Transformer({enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']});
            this.layer.add(this.tr);
            this.tr.nodes([]);

            this.layer.scaleX(initialScale);
            this.layer.scaleY(initialScale);
            this.layer.setPosition({
              x: - (this.image.width() * initialScale) / 2 + this.layer.width() / 2,
              y: - (this.image.height() * initialScale) / 2 + this.layer.height() / 2
            });
            return initialScale;
          }),
        );
      }),
      switchMap((initialScale) => {
        return combineLatest([
          this.value$,
          this.questionnaireService.getOrFetchQuestionnaires()
        ]).pipe(
          takeUntil(this.destroy$),
          tap(([sketch, questionnaires]: [Sketch | undefined | null, QuestionnaireModel[]]) => {
            if (!this.canEditSketch.transform(sketch) && !this.canConfirmSketch.transform(sketch)) {
              this.layer.canvas.getContext()._context.filter = 'blur(10px)';
            } else {
              this.layer.canvas.getContext()._context.filter = 'blur(0px)';
            }
            if (sketch?.editor !== this.cookieService.get(CookieName.sessionId) || this.cars.length === 0) {
              this.reDrawCars(sketch, questionnaires.length, initialScale);
            }
          })
        );
      })
    ).subscribe();
  }

  private reDrawCars(sketch: Sketch | undefined | null, questionnairesLength: number, scale: number) {
    this.removeCars();
    if (!sketch?.cars) {
      for (let i = 0; i < Math.max(questionnairesLength, 2); i++) {
        this.addCar();
      }
      this.saveCars();
    } else {
      sketch.cars.forEach(car => this.addCar(car));
      this.layer.setPosition({
        x: -sketch.cars[0].x * scale + this.layer.width() / 2,
        y: -sketch.cars[0].y * scale + this.layer.height() / 2
      });
    }
    this.observeDragPermissionsToCars();
  }

  saveCars() {
    const value = this.value$.getValue();

    if (!value) {
      this.handleModelChange({
        cars: this.cars.map(car => {
          return {
            x: car.x(),
            y: car.y(),
            scaleY: car.scaleY(),
            scaleX: car.scaleX(),
            id: car.id(),
            rotation: car.rotation()
          };
        }),
        editor: '',
        editing: false,
        confirmedEditors: []
      });
    }
  }

  editSketch() {
    const value = this.value$.getValue();
    if (value) {
      this.handleModelChange({
        ...value,
        editor: this.cookieService.get(CookieName.sessionId),
        confirmedEditors: [],
        editing: true
      });
    }

  }

  confirmSketch() {
    const value = this.value$.getValue();

    if (value) {
      value.confirmedEditors.push(this.cookieService.get(CookieName.sessionId));
      this.handleModelChange({
        ...value,
        cars: this.cars.map(car => {
          return {
            x: car.x(),
            y: car.y(),
            scaleY: car.scaleY(),
            scaleX: car.scaleX(),
            id: car.id(),
            rotation: car.rotation()
          };
        }),
        confirmedEditors: [...new Set(value.confirmedEditors)],
        editing: false
      });
    }
  }

  removeCars() {
    this.cars.forEach(car => car.remove());
    this.cars = [];
    this.layer.draw();
  }

  addCar(car?: CarData) {
    const imageObj = new Image();
    const id = (car?.id || Object.keys(this.cars).length + 1).toString();

    imageObj.src = `../../../assets/icons/google-car-${id}.svg`;

    const konvaImage = new Konva.Image({
      image: imageObj,
      draggable: true,
      scaleX: car?.scaleX || 0.06,
      scaleY: car?.scaleY || 0.06,
      rotation: car?.rotation || 90,
      x: car?.x || this.image.width() / 2 / this.stage.scaleX() + 20 * Object.keys(this.cars).length,
      y: car?.y || this.image.height() / 2 / this.stage.scaleX(),
      id: id
    });

    this.cars.push(konvaImage);
    this.layer.add(konvaImage);
    this.layer.draw();
  }

  private observeDragPermissionsToCars() {
    this.value$.pipe(
      takeUntil(this.destroy$),
      tap((value) => {
        if (!value) {
          return;
        }

        if (value.editor === this.cookieService.get(CookieName.sessionId) || !value.editing) {
          this.cars.map((car) => {
            car.setDraggable(true);
            car.on("dragstart", this.onDragStart.bind(this));
            car.on("dragend", this.onDragEnd.bind(this));
          });
        } else {
          this.cars.map(car => {
            this.tr.nodes([]);
            car.setDraggable(false);
            car.removeEventListener('dragstart');
            car.removeEventListener('dragend');
          });
        }
      })
    ).subscribe();
  }

  private onDragStart() {
    const value = this.value$.getValue();
    const editor = this.cookieService.get(CookieName.sessionId);

    if (value && !value.editing) {
      this.handleModelChange({
        ...value,
        confirmedEditors: [],
        editing: true,
        editor: editor
      });
    }
    this.isDragging = true;
  }

  private onDragEnd() {
    this.isDragging = false;
  }

  private onTouchEnd() {
    this.lastCenter = null;
    this.lastDist = 0;
  }

  private onClick($event: KonvaEventObject<'click'>) {
    if ($event.target === this.image) {
      this.tr.nodes([]);
    } else {
      this.tr.nodes([$event.target]);
      this.layer.draw();
    }
  }

  private onWheel($event: WheelEvent) {
    const scaleBy = 1.2;
    const oldScale = this.layer.scaleX();
    const mousePointTo = {
      x: $event.x / oldScale - this.layer.x() / oldScale,
      y: $event.y / oldScale - this.layer.y() / oldScale
    };
    let newScale = -$event.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    if (newScale <= this.layer.width() / this.layer.height()) {
      newScale = this.layer.width() / this.layer.height();
    }

    const x =
      -(mousePointTo.x - $event.x / newScale) * newScale;
    const y =
      -(mousePointTo.y - $event.y / newScale) * newScale;

    const pos = this.boundFunc({ x, y }, newScale);
    this.layer.scaleX(newScale);
    this.layer.scaleY(newScale);
    this.layer.setPosition(pos);
  }

  private onTouchMove($event: TouchEvent) {
      const touch1 = $event.touches[0];
      const touch2 = $event.touches[1];

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (this.layer.isDragging()) {
          this.layer.stopDrag();
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!this.lastCenter) {
          this.lastCenter = this.getCenter(p1, p2);
          return;
        }
        const newCenter = this.getCenter(p1, p2);

        const dist = this.getDistance(p1, p2);

        if (!this.lastDist) {
          this.lastDist = dist;
        }

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - this.layer.x()) / this.layer.scaleX(),
          y: (newCenter.y - this.layer.y()) / this.layer.scaleX(),
        };

        const scale = this.layer.scaleX() * (dist / this.lastDist);

        if (scale < 1) {
          return;
        }

        this.layer.scaleX(scale);
        this.layer.scaleY(scale);

        // calculate new position of the stage
        const dx = newCenter.x - this.lastCenter.x;
        const dy = newCenter.y - this.lastCenter.y;

        const newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        this.layer.position(newPos);

        this.lastDist = dist;
        this.lastCenter = newCenter;
      }

  }

  private getDistance(p1: PointData, p2: PointData) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  private getCenter(p1: PointData, p2: PointData) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  private boundFunc(pos: Vector2d, scale: number) {
    const imageWidth = this.image.width();
    const imageHeight = this.image.height();

    const x = Math.min(0, Math.max(pos.x, -1 * ((imageWidth * scale) - this.stage.width())));
    const y = Math.min(0, Math.max(pos.y, -1 * ((imageHeight * scale) - this.stage.height())));

    return {
      x,
      y
    };
  }

  dragBoundFunc = (pos: Vector2d) => {
    return this.boundFunc(pos, this.layer.scaleX());
  };


  ngOnDestroy() {
    this.step$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
