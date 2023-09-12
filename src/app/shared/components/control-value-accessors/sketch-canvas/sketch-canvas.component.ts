import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { PlaceSelectorData } from "@app/shared/components/control-value-accessors/place-selector/place-selector.component";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import {
  combineLatest,
  filter, from,
  fromEvent,
  Observable,
  of, pairwise,
  ReplaySubject, startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap
} from "rxjs";
import { ArrowType, Step } from "@app/home/pages/crash/flow.definition";
import { map } from "rxjs/operators";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { environment } from "../../../../../environments/environment";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import LatLngLiteral = google.maps.LatLngLiteral;
import Vector2d = Konva.Vector2d;
import { FilesApiService } from "@app/shared/api/files/files-api.service";
import { StorageItem } from "@app/shared/common/enumerators/storage";

export interface Sketch {
  cars: CarData[];
  editor: string;
  editing: boolean;
  confirmed_editors: string[];
  file_id: number;
  save?: boolean;
}

interface CarData {
  id: string;
  scaleY: number;
  scaleX: number;
  x: number;
  y: number;
  rotation: number;
  arrow: ArrowType;
  questionnaire_id: string;
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
  private readonly filesApiService: FilesApiService = inject(FilesApiService);

  @ViewChild('container', { static: true }) container!: ElementRef;
  private stage!: Konva.Stage;
  layer!: Konva.Layer;
  image!: Konva.Image;
  tr!: Konva.Transformer;
  cars: {group: Konva.Group, carData: CarData}[] = [];
  scale = 0;
  private lastCenter: PointData | null = null;
  private lastDist = 0;
  private isDragging = false;

  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly step$: ReplaySubject<Step> = new ReplaySubject<Step>();

  @Input() set step(step: Step) {
    this.step$.next(step);
  }

  get scale1(): number {
    return window.devicePixelRatio;
  }

  readonly positionData$: Observable<PlaceSelectorData | undefined> = this.step$.pipe(
    switchMap((step) => {
      if (step && step.data_from_input) {
        return this.questionnaireService.getOrFetchQuestionnaires().pipe(
          map(
            (questionnaires: QuestionnaireModel[]) => questionnaires[0].data.inputs[step.data_from_input || 0]?.value
          ),
        );
      }
      return of(undefined);
    })
  );

  readonly imageUrl$: Observable<string> = this.positionData$.pipe(
    map((positionData) => positionData?.marker_position),
    filter((markerPosition: LatLngLiteral | undefined): markerPosition is LatLngLiteral => !!markerPosition),
    map((markerPosition: LatLngLiteral) => {
      const imageSize = `${imageWidth}x${imageHeight}`;
      return `${environment.googleApiUrl}/staticmap?center=${markerPosition?.lat},${markerPosition.lng}&zoom=18&size=${imageSize}&key=${environment.googleApiKey}&scale=2&maptype=map`;
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
    this.scale = window.screen.availHeight / window.screen.availWidth;
    this.stage.add(this.layer);
  }

  private drawGoogleImageAndAddCars(): void {
    this.imageUrl$.pipe(
      takeUntil(this.destroy$),
      switchMap((imageUrl: string) => {
        const initialScale = 1;
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
            this.tr = new Konva.Transformer({enabledAnchors: []});
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
          this.value$.pipe(startWith(undefined), pairwise()),
          this.questionnaireService.getOrFetchQuestionnaires()
        ]).pipe(
          takeUntil(this.destroy$),
          tap(([[prevSketch, currenSketch], questionnaires]: [[Sketch | undefined | null, Sketch| undefined | null], QuestionnaireModel[]]) => {
            const sameArrows = prevSketch?.cars.map(car => car.arrow).sort().toString() === currenSketch?.cars.map(car => car.arrow).sort().toString();
            const redraw = !prevSketch || this.cars.length === 0 || !sameArrows;

            if (currenSketch?.editor !== this.cookieService.get(CookieName.sessionId) || redraw) {
              this.layer.scale({
                x: initialScale,
                y: initialScale
              });
              this.reDrawCars(currenSketch, questionnaires, initialScale);
            }
          })
        );
      })
    ).subscribe();
  }

  private reDrawCars(sketch: Sketch | undefined | null, questionnaires: QuestionnaireModel[], scale: number) {
    if (!sketch) {
      return;
    }
    this.removeCars();
    let firstCar: CarData | undefined = undefined;
    if (sketch.cars.length > 0 && sketch.cars[0].x) {
      this.layer.setPosition({
        x: -sketch.cars[0].x * scale + this.layer.width() / 2,
        y: -sketch.cars[0].y * scale + this.layer.height() / 2
      });
      firstCar = sketch.cars[0];
    }
    sketch.cars.forEach((car, index) => this.addCar(car, index, firstCar));
    this.observeDragPermissionsToCars();
  }

  editSketch() {
    const value = this.value$.getValue();
    if (value) {
      this.handleModelChange({
        ...value,
        editor: this.cookieService.get(CookieName.sessionId),
        confirmed_editors: [],
        editing: true,
        save: true
      });
    }

  }

  confirmSketch() {
    const value = this.value$.getValue();

    if (value) {
      value.confirmed_editors.push(this.cookieService.get(CookieName.sessionId));
      this.getUploadedImageFileId().pipe(
        take(1)
      ).subscribe((file_id) => {
        this.handleModelChange({
          ...value,
          cars: this.cars.map(car => {
            return {
              x: car.group.x(),
              y: car.group.y(),
              scaleY: car.group.scaleY() * window.devicePixelRatio,
              scaleX: car.group.scaleX() * window.devicePixelRatio,
              id: car.group.id(),
              rotation: car.group.rotation(),
              arrow: car.carData.arrow,
              questionnaire_id: car.carData.questionnaire_id,
            };
          }),
          confirmed_editors: [...new Set(value.confirmed_editors)],
          editing: false,
          save: true,
          file_id: file_id
        });
      });
    }
  }

  removeCars() {
    this.cars.forEach(car => car.group.remove());
    this.cars = [];
    this.layer.draw();
  }

  addCar(car: CarData, index: number, firstCar?: CarData) {
    const imageObj = new Image();

    imageObj.src = `../../../assets/icons/google-car-${index + 1}.svg`;

    const x = car?.x || (firstCar?.x ? firstCar.x + 20 : undefined) || (this.image.width() / 2 / this.stage.scaleX() + 20 * index);
    const y = car?.y || firstCar?.y || this.image.height() / 2 / this.stage.scaleX();

    return fromEvent(imageObj, 'load').pipe(
      tap(() => {
        const konvaImage = new Konva.Image({
          image: imageObj,
          draggable: false,
          scaleX: 0.08 / window.devicePixelRatio,
          scaleY: 0.08 / window.devicePixelRatio,
          rotation: 90,
          x: 0,
          y: 0,
          id: car.id
        });
        const group = new Konva.Group({
          x: x,
          y: y,
          draggable: true,
          scaleX: car?.scaleX || 1,
          scaleY: car?.scaleY || 1,
          rotation: car?.rotation,
          id: car.id
        });

        group.add(this.gerArrowFromType(car.arrow, konvaImage));
        group.add(konvaImage);
        this.layer.add(group);
        this.layer.draw();

        group.on('transformstart', this.onDragStart.bind(this));
        group.on('dragstart', this.onDragStart.bind(this));
        group.on('dragend', this.onDragEnd.bind(this));
        this.cars.push({group: group, carData: car});
      })
    ).pipe(take(1)).subscribe();
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
            car.group.setDraggable(true);
            car.group.on("dragstart", this.onDragStart.bind(this));
            car.group.on("dragend", this.onDragEnd.bind(this));
          });
        } else {
          this.cars.map(car => {
            this.tr.nodes([]);
            car.group.setDraggable(false);
            car.group.removeEventListener('dragstart');
            car.group.removeEventListener('dragend');
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
        confirmed_editors: [],
        editing: true,
        editor: editor,
        save: true
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
      if ($event.target.parent) {
        const parent = $event.target.parent.attrs.id === 'arrow' ? $event.target.parent.parent : $event.target.parent;
        if (parent) {
          this.tr.nodes([parent]);
          this.layer.draw();
        }
      }
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
    if (this.layer.width() / newScale > this.image.width() || this.layer.height() / newScale > this.image.height()) {
      newScale = this.layer.scaleX();
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

        let scale = this.layer.scaleX() * (dist / this.lastDist);
        if (this.layer.width() / scale > this.image.width() || this.layer.height() / scale > this.image.height()) {
          scale = this.layer.scaleX();
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

  private gerArrowFromType(arrowType: ArrowType, carImage: Konva.Image): Konva.Group {
    const group = new Konva.Group({
      x: 0,
      y: 0,
      id: "arrow"
    });

    const initialX = -(carImage.width() * carImage.scaleX()) / 4;
    const initialY = (carImage.height() * carImage.scaleX());

    const quadraticLine = new Konva.Shape({
      stroke: 'red',
      strokeWidth: 2,
      draggable: false
    });

    const bezierLine = new Konva.Shape({
      stroke: 'red',
      strokeWidth: 2,
      draggable: false
    });

    const arrow = new Konva.Arrow({
      points: [0, 0, 0, 0, 0, 0],
      pointerLength: 3,
      pointerWidth: 2,
      fill: 'red',
      stroke: 'red',
      strokeWidth: 3,
      draggable: false,
      visible: false
    });

    if (arrowType === ArrowType.left) {
      quadraticLine.sceneFunc(((ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.quadraticCurveTo(
          initialX,
          initialY + 30,
          initialX + 20,
          initialY + 30
        );
        ctx.fillStrokeShape(shape);
      }));
      arrow.x(initialX + 20);
      arrow.y(initialY + 30);
      arrow.visible(true);
    } else if (arrowType === ArrowType.right) {
      quadraticLine.sceneFunc(((ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.quadraticCurveTo(
          initialX,
          initialY + 30,
          initialX - 20,
          initialY + 30
        );
        ctx.fillStrokeShape(shape);
      }));
      arrow.x(initialX - 20);
      arrow.y(initialY + 30);
      arrow.visible(true);
      arrow.rotation(180);
    } else if (arrowType === ArrowType.reverse) {
      quadraticLine.sceneFunc(((ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.quadraticCurveTo(
          initialX,
          initialY - 25,
          initialX,
          initialY - 25
        );
        ctx.fillStrokeShape(shape);
      }));
      arrow.x(initialX);
      arrow.y(initialY - 25);
      arrow.visible(true);
      arrow.rotation(270);
    } else if (arrowType === ArrowType.straight) {
      quadraticLine.sceneFunc(((ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.quadraticCurveTo(
          initialX,
          initialY + 30,
          initialX,
          initialY + 30
        );
        ctx.fillStrokeShape(shape);
      }));
      arrow.x(initialX);
      arrow.y(initialY + 30);
      arrow.visible(true);
      arrow.rotation(90);
    } else if (arrowType === ArrowType.straightLeft) {
      bezierLine.sceneFunc(((ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.bezierCurveTo(
          initialX,
          initialY + 50,
          initialX + 20,
          initialY + 20,
          initialX + 20,
          initialY + 60
        );
        ctx.fillStrokeShape(shape);
      }));
      arrow.x(initialX + 20);
      arrow.y(initialY + 60);
      arrow.visible(true);
      arrow.rotation(90);
    } else if (arrowType === ArrowType.straightRight) {
      bezierLine.sceneFunc(((ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.bezierCurveTo(
          initialX,
          initialY + 50,
          initialX - 20,
          initialY + 20,
          initialX - 20,
          initialY + 60
        );
        ctx.fillStrokeShape(shape);
      }));
      arrow.x(initialX - 20);
      arrow.y(initialY + 60);
      arrow.visible(true);
      arrow.rotation(90);
    }

    group.add(quadraticLine);
    group.add(bezierLine);
    group.add(arrow);
    return group;


    // const arrow = new Konva.Arrow({
    //   x: -(carImage.width() * carImage.scaleX()) / 4,
    //   y: (carImage.height() * carImage.scaleX()),
    //   points: [0, 0, 0, 40],
    //   pointerLength: 5,
    //   pointerWidth: 6,
    //   fill: 'red',
    //   stroke: 'red',
    //   strokeWidth: 2,
    // });
    //
    // if (arrowType === ArrowType.reverse) {
    //   arrow.rotation(180);
    // }
    //
    // return arrow;
  }


  dragBoundFunc = (pos: Vector2d) => {
    return this.boundFunc(pos, this.layer.scaleX());
  };


  getUploadedImageFileId(): Observable<number> {
    const sketch = this.value$.getValue();

    const newKonva = this.stage.clone();
    newKonva.width(1000);
    newKonva.height(1000);
    const layer = newKonva.getLayers()[0];
    layer.scale({x: 1.5, y: 1.5});

    if (sketch) {
      const car = this.cars[0];
      if (car) {
        layer.setPosition({
          x: -car.group.x() * layer.scaleX() + layer.width() / 2,
          y: -car.group.y() * layer.scaleX() + layer.height() / 2
        });
        // this.layer.scale({x: 2, y: 2});
      }
    }

    return from(newKonva.toBlob({ pixelRatio: 1 })).pipe(
      takeUntil(this.destroy$),
      take(1),
      switchMap((blob: any) => {
        const sessionId = localStorage.getItem(StorageItem.sessionId);
        return this.filesApiService.uploadFile(new File([blob], `${sessionId}.png`)).pipe(
          map((response) => response.id),
          tap(() => newKonva.remove())
        );
      })
    );
  }

  ngOnDestroy() {
    this.step$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
