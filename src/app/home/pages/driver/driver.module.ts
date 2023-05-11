import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverComponent } from './driver.component';
import { ApiModule } from "../../../shared/api/api.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";
import { TranslocoModule } from "@ngneat/transloco";


@NgModule({
  declarations: [
    DriverComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: DriverComponent
          }
        ]
      }
    ]),
    TranslocoModule
  ]
})
export class DriverModule { }
