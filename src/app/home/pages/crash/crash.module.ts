import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashComponent } from "./crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";
import { BaseFormModalModule } from "../../../shared/components/modals/base-form-modal/base-form-modal.module";
import { CarFormModule } from "../../../shared/components/forms/car-form/car-form.module";


@NgModule({
  declarations: [
    CrashComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    TranslocoModule,
    BaseFormModalModule,
    CarFormModule,
    RouterModule.forChild([
      {
        path: "",
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: CrashComponent
          }
        ]
      }
    ])
  ]
})
export class CrashModule { }
