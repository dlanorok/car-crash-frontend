import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinCrashComponent } from './join-crash.component';
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { InviteParticipantsModule } from "@app/home/pages/accident-report-flow/invite-participants/invite-participants.module";



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
    InviteParticipantsModule
  ]
})
export class JoinCrashModule { }
