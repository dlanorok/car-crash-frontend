import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinCrashComponent } from './join-crash.component';
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";



@NgModule({
  declarations: [
    JoinCrashComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: JoinCrashComponent
      }
    ]),
    TranslocoModule,
  ]
})
export class JoinCrashModule { }
