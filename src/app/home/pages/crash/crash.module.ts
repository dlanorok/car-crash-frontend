import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashComponent } from "./crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "@app/shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";


@NgModule({
  declarations: [
    CrashComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    TranslocoModule,
    RouterModule.forChild([
      {
        path: "",
        component: CrashComponent,
      }
    ])
  ]
})
export class CrashModule { }
