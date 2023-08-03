import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialImpactComponent } from './initial-impact.component';
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { RouterModule } from "@angular/router";
import { PointOfInitialImpactModule } from "@app/shared/components/control-value-accessors/svg-selector/point-of-initial-impact/point-of-initial-impact.module";



@NgModule({
  declarations: [
    InitialImpactComponent
  ],
  imports: [
    CommonModule,
    PointOfInitialImpactModule,
    FooterButtonsModule,
    RouterModule.forChild([
      {
        path: "",
        component: InitialImpactComponent,
      },
    ]),
  ]
})
export class InitialImpactModule { }
