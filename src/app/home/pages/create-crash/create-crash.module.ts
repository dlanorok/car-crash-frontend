import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCrashComponent } from "./create-crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";


@NgModule({
  declarations: [CreateCrashComponent],
  imports: [
    CommonModule,
    ApiModule,
    RouterModule.forChild([
      {
        path: "",
        component: CreateCrashComponent
      }
    ]),
    TranslocoModule
  ],
})
export class CreateCrashModule { }
