import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ApiModule } from "@app/shared/api/api.module";
import { TranslocoModule } from "@ngneat/transloco";
import { WelcomeComponent } from "./welcome.component";
import { CrashFormModule } from "@app/shared/components/forms/crash-form/crash-form.module";
import { BaseFormModalModule } from "@app/shared/components/modals/base-form-modal/base-form-modal.module";


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    ApiModule,
    BaseFormModalModule,
    RouterModule.forChild([
      {
        path: "",
        component: WelcomeComponent
      }
    ]),
    RouterModule,
    TranslocoModule,
    CrashFormModule
  ],
})
export class WelcomeModule {
}
