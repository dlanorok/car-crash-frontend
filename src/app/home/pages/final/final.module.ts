import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalComponent } from './final.component';
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    FinalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: FinalComponent
      }
    ]),
  ]
})
export class FinalModule { }
