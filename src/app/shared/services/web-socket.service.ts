import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { retry, tap, throwError } from "rxjs";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { catchError } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { updateCarSubModelSuccessful, wsCarUpdated } from "@app/app-state/car/car-action";
import { PolicyHolderModel } from "@app/shared/models/policy-holder.model";
import { InsuranceModel } from "@app/shared/models/insurance.model";
import { DriverModel } from "@app/shared/models/driver.model";
import { CrashModel } from "@app/shared/models/crash.model";
import { addCar, crashUpdateWS } from "@app/app-state/crash/crash-action";
import { CarModel } from "@app/shared/models/car.model";
import { CookieService } from "ngx-cookie-service";
import { CircumstanceModel } from "@app/shared/models/circumstance.model";
import { environment } from "../../../environments/environment";
import { wsSketchCarUpdated, wsSketchPolygonsUpdated, wsSketchUpdated } from "@app/app-state/sketch/sketch-action";
import { PolygonsData, SketchCarModel, SketchModel } from "@app/shared/models/sketch.model";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";

interface WebSocketMessage {
  type: string;
  model_name: string;
  sender_id: string;
  model: any
}

export enum EventType {
  modelCreated = 'model_create',
  modelUpdated = 'model_update'
}

export enum SpecialModelName {
  SketchCarUpdated = 'SketchCarUpdated',
  SketchPolygonsUpdated = 'SketchPolygonsUpdated',
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket$!: WebSocketSubject<any>;
  connected = false;

  constructor(
    private readonly store: Store,
    private readonly cookieService: CookieService,
    private readonly questionnaireService: QuestionnaireService
  ) {}

  connect(): void {
    if (this.connected) {
      return;
    }
    this.socket$ = webSocket<any>({
      url: `${environment.webSocketUrl}/ws/updates/${localStorage.getItem(StorageItem.sessionId)}/`,
    });

    this.connected = true;

    this.socket$
      .pipe(
        tap((message: WebSocketMessage) => {
          // Skip events created from me
          // if (message.sender_id === this.cookieService.get(CookieName.sessionId)) {
          //   return;
          // }

          if (message.type === EventType.modelUpdated || message.type === EventType.modelCreated) {
            this.processModelEvents(message);
          }
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        }),
        retry({delay: 5000})
      )
      .subscribe();
  }

  private processModelEvents(message: WebSocketMessage) {
    let model;
    let storeActions: any[] = [];
    switch (message.model_name) {
      case 'PolicyHolder':
        model = new PolicyHolderModel(message.model);
        storeActions = [updateCarSubModelSuccessful({carId: model.car, model: model})];
        break;
      case 'Insurance':
        model = new InsuranceModel(message.model);
        storeActions = [updateCarSubModelSuccessful({carId: model.car, model: model})];
        break;
      case 'Driver':
        model = new DriverModel(message.model);
        storeActions = [updateCarSubModelSuccessful({carId: model.car, model: model})];
        break;
      case 'Circumstance':
        model = new CircumstanceModel(message.model);
        storeActions = [updateCarSubModelSuccessful({carId: model.car, model: model})];
        break;
      case 'Crash':
        model = new CrashModel(message.model);
        storeActions = [crashUpdateWS({crash: model})];
        break;
      case 'Car':
        model = new CarModel(message.model);
        message.type === EventType.modelUpdated
          ? storeActions.push(wsCarUpdated({car: model}))
          : storeActions.push(addCar({carId: model.id, addToMyCars: false}));
        break;
      case 'Sketch':
        model = new SketchModel(message.model);
        storeActions = [wsSketchUpdated({sketch: model})];
        break;
      case 'Questionnaire':
        model = new QuestionnaireModel(message.model);
        this.questionnaireService.updateQuestionnaire(model);
        break;
      case SpecialModelName.SketchCarUpdated:
        storeActions = [wsSketchCarUpdated({sketchCar: message.model as SketchCarModel})];
        break;
      case SpecialModelName.SketchPolygonsUpdated:
        storeActions = [wsSketchPolygonsUpdated({polygonData: JSON.parse(message.model) as PolygonsData})];
        break;
    }

    storeActions.forEach(action => {
      this.store.dispatch(action);
    });
  }

  close(): void {
    this.connected = false;
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  send(data: any): void {
    if (this.socket$) {
      this.socket$.next(data);
    }
  }

  ngOnDestroy(): void {
    this.connected = false;
    this.socket$.complete();
  }
}
