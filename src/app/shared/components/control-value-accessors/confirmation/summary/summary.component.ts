import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { Step } from "@app/home/pages/crash/flow.definition";
import { CrashesApiService } from "@app/shared/api/crashes/crashes-api.service";
import { combineLatest, filter, Observable, startWith, switchMap } from "rxjs";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { Store } from "@ngrx/store";
import { loadCrash } from "@app/app-state/crash/crash-action";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { CarModel } from "@app/shared/models/car.model";
import { TranslocoService } from "@ngneat/transloco";
import { DatePipe } from "@angular/common";
import { selectCars } from "@app/app-state/car/car-selector";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";

interface Group {
  name: string;
  items: Item[]
}

interface Item {
  label: string;
  value?: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  providers: [provideControlValueAccessor(SummaryComponent), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent extends BaseFormControlComponent<boolean> implements OnInit {
  private readonly crashesApiService: CrashesApiService = inject(CrashesApiService);
  private readonly translateService: TranslocoService = inject(TranslocoService);
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly datePipe: DatePipe = inject(DatePipe);
  private readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  @Input() step!: Step;
  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<void> = new EventEmitter<void>();

  crash$: Observable<CrashModel> = this.store.select(selectCrash);
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  questionnairesGroup$: Observable<Group[][]> = combineLatest([
    this.crash$.pipe(filter((crash): crash is CrashModel => !!crash.id)),
    this.questionnaireService.questionnaireUpdates$.pipe(startWith(undefined))
  ]).pipe(
    switchMap(([crash, _]) => {
      return this.crashesApiService.getSummary(crash).pipe(
        map((cars: CarModel[]) => {
          return cars.map(car => {
            return [
              {
                name: this.translateService.translate('car-crash.confirmation.summary.participated-driver-data.title'),
                items: [
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-driver-data.name.label'),
                    value: `${car.driver?.name} ${car.driver?.surname}`
                  },
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-driver-data.address.label'),
                    value: car.driver?.address
                  },
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-driver-data.phone.label'),
                    value: car.driver?.phone_number
                  },
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-driver-data.email.label'),
                    value: car.driver?.email
                  },
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-driver-data.responsibility-type.label'),
                    value: car.responsibility_type
                      ? this.translateService.translate(`car-crash.confirmation.summary.participated-driver-data.responsibility-type-${car.responsibility_type}.label`)
                      : ""
                  }
                ]
              },

              {
                name: this.translateService.translate('car-crash.confirmation.summary.participated-driver-data.responsibility-type.label'),
                items: [
                  {
                    label: car.responsibility_type
                      ? this.translateService.translate(`car-crash.confirmation.summary.participated-driver-data.responsibility-type-${car.responsibility_type}.label`)
                      : "",
                    value: ''
                  }
                ]
              },

              {
                name: this.translateService.translate('car-crash.confirmation.summary.participated-vehicle-data.title'),
                items: [
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-vehicle-data.type.label'),
                    value: car.car_type
                  },
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-vehicle-data.registration-number.label'),
                    value: car.registration_plate
                  },
                ]
              },
              {
                name: this.translateService.translate('car-crash.confirmation.summary.participated-insurance-data.title'),
                items: [
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-insurance-data.number.label'),
                    value: car.insurance?.policy_number
                  },
                  {
                    label: this.translateService.translate('car-crash.confirmation.summary.participated-insurance-data.policy-valid-to.label'),
                    value: car.insurance?.valid_until ? this.datePipe.transform(new Date(car.insurance?.valid_until), 'd. M. YYYY') || '' : ''
                  },
                ]
              },
            ];
          });
        })
      );
    }),
  );

  handleNext() {
    this.handleModelChange(true);
    this.next.emit();
  }

  ngOnInit() {
    super.ngOnInit();
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCrash({sessionId}));
  }
}
