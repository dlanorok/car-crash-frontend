import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { InsuranceComponent } from "./insurance.component";
import { InsuranceFormModule } from "@app/shared/components/forms/insurance-form/insurance-form.module";
import { ApiModule } from "@app/shared/api/api.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";


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
        component: InsuranceComponent,
      }
    ]),
    TranslocoModule,
    FooterButtonsModule
  ]
})
export class InsuranceModule { }
