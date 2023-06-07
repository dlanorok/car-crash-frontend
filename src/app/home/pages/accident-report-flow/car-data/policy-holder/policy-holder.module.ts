import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyHolderComponent } from './policy-holder.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { PolicyHolderFormModule } from "@app/shared/components/forms/policy-holder-form/policy-holder-form.module";
import { ApiModule } from "@app/shared/api/api.module";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { OcrComponentModule } from "@app/shared/components/ocr-component/ocr-component.module";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";


@NgModule({
  declarations: [
    PolicyHolderComponent
  ],
  exports: [ PolicyHolderComponent ],
  imports: [
    CommonModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PolicyHolderComponent
      }
    ]),
    TranslocoModule,
    PolicyHolderFormModule,
    FooterButtonsModule,
    OcrComponentModule,
    SvgIconModule
  ]
})
export class PolicyHolderModule { }
