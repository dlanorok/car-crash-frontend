import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyHolderFormComponent } from './policy-holder-form.component';
import { TranslocoModule } from "@ngneat/transloco";
import { ReactiveFormsModule } from "@angular/forms";
import { TextControlModule } from "../../../form-controls/text-control/text-control.module";



@NgModule({
    declarations: [
        PolicyHolderFormComponent
    ],
    exports: [
        PolicyHolderFormComponent
    ],
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    TextControlModule,
  ]
})
export class PolicyHolderFormModule { }
