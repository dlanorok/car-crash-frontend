import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashComponent } from "./crash.component";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { ApiModule } from "../../../shared/api/api.module";



@NgModule({
  declarations: [
    CrashComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    RouterModule.forChild([
      {
        path: "",
        component: CrashComponent
      }
    ]),
    MatButtonModule
  ]
})
export class CrashModule { }
