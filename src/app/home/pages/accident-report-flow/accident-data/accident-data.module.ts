import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentDataComponent } from './accident-data.component';
import { RouterModule } from "@angular/router";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { CrashFormModule } from "@app/shared/components/forms/crash-form/crash-form.module";


@NgModule({
  declarations: [
    AccidentDataComponent,
  ],
  imports: [
    CommonModule,
    CrashFormModule,
    RouterModule.forChild([
      {
        path: "",
        component: AccidentDataComponent,
      }
    ]),
    FooterButtonsModule,
  ]
})
export class AccidentDataModule {
}
