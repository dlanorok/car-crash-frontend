import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarComponent } from './car.component';
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";


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
    TranslocoModule
  ]
})
export class CarModule { }
