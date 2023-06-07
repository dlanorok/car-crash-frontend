import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircumstancesComponent } from './circumstances.component';
import { RouterModule } from "@angular/router";
import { CircumstanceFormModule } from "@app/shared/components/forms/circumstance-form/circumstance-form.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";



@NgModule({
  declarations: [
    CircumstancesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: CircumstancesComponent,
      }
    ]),
    CircumstanceFormModule,
    FooterButtonsModule,
  ]
})
export class CircumstancesModule { }
