import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CarModel } from "../../../shared/models/car.model";
import { map, Observable, take, tap } from "rxjs";
import { CrashModel } from "../../../shared/models/crash.model";
import { Store } from "@ngrx/store";
import { loadCrash } from "../../../app-state/crash/crash-action";
import { selectCrash } from "../../../app-state/crash/crash-selector";
import { selectCars } from "../../../app-state/car/car-selector";
import { createCar, deleteCar, updateCar } from "../../../app-state/car/car-action";
import { ModalService } from "../../../shared/services/modal.service";
import { BaseFormModalComponent } from "../../../shared/components/modals/base-form-modal/base-form-modal.component";
import { CarFormComponent } from "../../../shared/components/forms/car-form/car-form.component";
import { CarFormModule } from "../../../shared/components/forms/car-form/car-form.module";

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  crash$: Observable<(CrashModel | undefined)> = this.store.select(selectCrash);
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getData();
  }


  createCar() {
    this.modalService.open(BaseFormModalComponent, {
      formComponent: {
        component: CarFormComponent,
        module: CarFormModule,
      },
      model: new CarModel(),
      title: 'Create car',
      afterSubmit$: (car: CarModel) =>
        this.crash$
          .pipe(
            take(1),
            tap((crash: CrashModel | undefined) => {
              if (!crash) {
                throw new Error("CrashModel undefined");
              }
              car.crash = crash.id
              this.store.dispatch(createCar({car: car}))
            }),
          )
    });
  }

  editCar(car: CarModel) {
    this.modalService.open(BaseFormModalComponent, {
      formComponent: {
        component: CarFormComponent,
        module: CarFormModule,
      },
      model: car,
      title: 'Edit car',
      afterSubmit$: (car: CarModel) =>
        this.crash$
          .pipe(
            take(1),
            tap((crash: CrashModel | undefined) => {
              if (!crash) {
                throw new Error("CrashModel undefined");
              }
              car.crash = crash.id
              this.store.dispatch(updateCar({car: car}))
            }),
          )
    });
  }

  deleteCar(carId: number) {
    this.crash$
      .pipe(
        take(1),
        tap((crash: CrashModel | undefined) => {
          if (!crash) {
            throw new Error("CrashModel undefined");
          }
          this.store.dispatch(deleteCar({carId: carId}))
        }),
      ).subscribe()
  }

  getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('sessionId')),
        tap((sessionId: string | null) => {
          if (sessionId) {
            this.store.dispatch(loadCrash({sessionId: sessionId}));
          }
        }),
      )
      .subscribe()
  }
}
