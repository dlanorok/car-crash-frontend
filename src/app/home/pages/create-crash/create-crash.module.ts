import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCrashComponent } from "./create-crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "../../../shared/api/api.module";


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
    ])
  ],
})
export class CreateCrashModule { }
