import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashComponent } from "./crash.component";
import { RouterModule } from "@angular/router";
import { ApiModule } from "@app/shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";
import { CheckboxControlModule } from "@app/shared/form-controls/checkbox-control/checkbox-control.module";
import { FormsModule } from "@angular/forms";
import { GetStateFromSectionModule } from "@app/shared/common/pipes/get-state-from-section.module";
import { CarIdentifierModule } from "@app/shared/common/pipes/car-identifier/car-identifier.module";
import { AmICreatorModule } from "@app/shared/common/pipes/am-i-creator/am-i-creator.module";
import { FileUploadModule } from "@app/shared/components/file-upload/file-upload.module";


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
    CarIdentifierModule,
    AmICreatorModule,
    FileUploadModule,
  ]
})
export class CrashModule { }
