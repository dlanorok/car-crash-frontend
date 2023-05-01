import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarComponent } from './car.component';
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";


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
        component: CarComponent
      }
    ])
  ]
})
export class CarModule { }
