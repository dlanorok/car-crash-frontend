import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule } from "../../../shared/api/api.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";
import { TranslocoModule } from "@ngneat/transloco";
import { InsuranceComponent } from "./insurance.component";
import { InsuranceFormModule } from "../../../shared/components/forms/insurance-form/insurance-form.module";


@NgModule({
  declarations: [
    InsuranceComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    InsuranceFormModule,
    RouterModule.forChild([
      {
        path: "",
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: InsuranceComponent
          }
        ]
      }
    ]),
    TranslocoModule
  ]
})
export class InsuranceModule { }
