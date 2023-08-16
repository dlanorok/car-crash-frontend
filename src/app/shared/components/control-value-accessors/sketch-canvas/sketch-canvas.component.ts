import { Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { PlaceSelectorData } from "@app/shared/components/control-value-accessors/place-selector/place-selector.component";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { filter, Observable, of, ReplaySubject, Subject, switchMap, takeUntil, tap, combineLatest } from "rxjs";
import { Step } from "@app/home/pages/crash/flow.definition";
import { map } from "rxjs/operators";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import LatLngLiteral = google.maps.LatLngLiteral;
import { environment } from "../../../../../environments/environment";
import Konva from "konva";
import Vector2d = Konva.Vector2d;
import { KonvaEventObject } from "konva/lib/Node";

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

const imageWidth = 500;
const imageHeight = 700;

@Component({
  selector: 'app-sketch-canvas',
  templateUrl: './sketch-canvas.component.html',
  styleUrls: ['./sketch-canvas.component.scss'],
  providers: [provideControlValueAccessor(SketchCanvasComponent)],
})
export class SketchCanvasComponent extends BaseFormControlComponent<CarData[]> implements OnInit, OnDestroy {
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);

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
      return `${environment.googleApiUrl}/staticmap?center=${markerPosition?.lat},${markerPosition.lng}&zoom=19&size=${imageSize}&key=${environment.googleApiKey}&scale=2&maptype=satellite`;
    }),
  );

  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: this.container.nativeElement,
      width: imageWidth,
      height: imageHeight,
    });
    this.layer = new Konva.Layer({
      draggable: true,
      dragBoundFunc: this.dragBoundFunc,
    });
    this.stage.add(this.layer);

    this.observeImageData();
    this.fixStageIntoParentContainer();
    window.addEventListener('resize', this.fixStageIntoParentContainer.bind(this));
    window.addEventListener('touchend', this.onTouchEnd.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this));
    this.layer.on("click tap", this.onClick.bind(this));

    this.tr = new Konva.Transformer();
    this.layer.add(this.tr);
    this.tr.nodes([]);
  }

  private observeImageData(): void {
    this.imageUrl$.pipe(
      takeUntil(this.destroy$),
      tap((imageUrl: string) => {
        const image = new Image();
        image.src = imageUrl;
        this.image = new Konva.Image({
          image: image,
          width: this.stage.width(),
          height: this.stage.height(),
        });
        this.layer.add(this.image);
        this.layer.draw();
        this.fitImageToStage();
      }),
      switchMap(() => {
        return combineLatest([
          this.value$,
          this.questionnaireService.getOrFetchQuestionnaires()
        ]).pipe(
          takeUntil(this.destroy$),
          tap(([cars, questionnaires]: [CarData[] | undefined | null, QuestionnaireModel[]]) => {
            this.removeCars();
            if (!cars) {
              this.layer.setPosition({
                x: -this.stage.width() / 2 / this.stage.scaleX() - this.layer.width() / 3,
                y: -this.stage.height() / 2 / this.stage.scaleX() - this.layer.height() / 3
              });
              this.layer.scaleX(2.5);
              this.layer.scaleY(2.5);
              questionnaires.forEach(q => this.addCar());
            } else {
              cars.forEach(car => this.addCar(car));
            }
          })
        );
      })
    ).subscribe();
  }

  confirmSketch() {
    this.handleModelChange(this.cars.map(car => {
      return {
        x: car.x(),
        y: car.y(),
        scaleY: car.scaleY(),
        scaleX: car.scaleX(),
        id: car.id(),
        rotation: car.rotation()
      };
    }));
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
      x: car?.x || this.stage.width() / 2 / this.stage.scaleX() + 20 * Object.keys(this.cars).length,
      y: car?.y || this.stage.height() / 2 / this.stage.scaleX(),
      id: id
    });
    this.cars.push(konvaImage);
    this.layer.add(konvaImage);
    this.layer.draw();
    konvaImage.on("dragstart", this.onDragStart.bind(this));
    konvaImage.on("dragend", this.onDragEnd.bind(this));

    // const rect = new Konva.Rect({
    //   x: Math.random() * this.stage.width(),
    //   y: Math.random() * this.stage.height(),
    //   width: 50,
    //   height: 50,
    //   fill: 'blue',
    //   draggable: true,
    // });
    // const tr = new Konva.Transformer();
    // this.layer.add(tr);
    // tr.nodes([rect]);
    //
    // this.layer.add(rect);
    // this.layer.draw();
  }

  private onDragStart() {
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
      this.stage.draw();
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
    if (newScale <= 1) {
      newScale = 1;
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
          this.fixStageIntoParentContainer();
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

  private fixStageIntoParentContainer() {
    const container = document.getElementById('canvas-container');

    if (!container) {
      return;
    }

    // now we need to fit stage into parent container
    const containerWidth = container.offsetWidth;

    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    const scale = containerWidth / imageWidth;

    if (imageHeight * scale > imageHeight) {
      return;
    }

    this.stage.width(imageWidth * scale);
    this.stage.height(imageHeight * scale);
    this.stage.scale({ x: scale, y: scale });
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
    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();

    const x = Math.min(0, Math.max(pos.x, stageWidth * (1 - scale)));
    const y = Math.min(0, Math.max(pos.y, stageHeight * (1 - scale)));

    return {
      x,
      y
    };
  }

  dragBoundFunc = (pos: Vector2d) => {
    return this.boundFunc(pos, this.layer.scaleX());
  };


  fitImageToStage() {

    this.layer.x(0);
    this.layer.y(0);
    this.layer.scale({x: 1, y: 1});
    this.fixStageIntoParentContainer();
  }


  ngOnDestroy() {
    this.step$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
