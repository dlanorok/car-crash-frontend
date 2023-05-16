import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrashFormComponent } from './crash-form.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { DateControlModule } from "../../../form-controls/date-control/date-control.module";
import { FormErrorsModule } from "../shell/form-errors/form-errors.module";
import { TextControlModule } from "../../../form-controls/text-control/text-control.module";
import { CheckboxControlModule } from "../../../form-controls/checkbox-control/checkbox-control.module";


@NgModule({
  declarations: [
    CrashFormComponent
  ],
  exports: [
    CrashFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    DateControlModule,
    FormErrorsModule,
    TextControlModule,
    CheckboxControlModule,
  ],
})
export class CrashFormModule { }
