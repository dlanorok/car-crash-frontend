import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashComponent } from "./crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "@app/shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";
import { CheckboxControlModule } from "@app/shared/form-controls/checkbox-control/checkbox-control.module";
import { FormsModule } from "@angular/forms";
import { AmICreatorModule } from "@app/shared/common/pipes/am-i-creator/am-i-creator.module";
import { GetStateFromSectionModule } from "@app/shared/common/pipes/get-state-from-section/get-state-from-section.module";
import { AllStepsCompletedModule } from "@app/shared/common/pipes/all-steps-completed/all-steps-completed.module";


@NgModule({
  declarations: [
    CrashComponent,
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
    ]),
    CheckboxControlModule,
    FormsModule,
    GetStateFromSectionModule,
    AllStepsCompletedModule,
    AmICreatorModule,
  ]
})
export class CrashModule { }
