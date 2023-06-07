import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialImpactComponent } from './initial-impact.component';
import { PointOfInitialImpactModule } from "@app/shared/components/ui/point-of-initial-impact/point-of-initial-impact.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { RouterModule } from "@angular/router";



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
