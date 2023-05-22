import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarComponent } from './car.component';
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";
import { PageTitleModule } from "../../../shared/components/page-title/page-title.module";
import { CarFormModule } from "../../../shared/components/forms/car-form/car-form.module";
import { InsuranceFormModule } from "../../../shared/components/forms/insurance-form/insurance-form.module";
import { DriverFormModule } from "../../../shared/components/forms/driver-form/driver-form.module";
import { PolicyHolderFormModule } from "../../../shared/components/forms/policy-holder-form/policy-holder-form.module";
import { StepperModule } from "../../../shared/components/stepper/stepper.module";


@NgModule({
  declarations: [
    CarComponent
  ],
    imports: [
        CommonModule,
        ApiModule,
        RouterModule.forChild([
            {
                path: "",
                component: MainLayoutComponent,
                children: [
                    {
                        path: '',
                        component: CarComponent
                    }
                ]
            }
        ]),
        ReactiveFormsModule,
        TranslocoModule,
        PageTitleModule,
        CarFormModule,
        InsuranceFormModule,
        DriverFormModule,
        PolicyHolderFormModule,
        StepperModule
    ]
})
export class CarModule { }
