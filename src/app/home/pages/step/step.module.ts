import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepComponent } from './step.component';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GetStepInputsPipe } from "@app/home/pages/step/pipes/get-step-inputs.pipe";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { ToDatePipe } from "@app/home/pages/step/pipes/to-date.pipe";
import { DynamicControlFromInputModule } from "@app/shared/common/pipes/dynamic-control-from-input/dynamic-control-from-input.module";
import { DynamicControlDirective } from "@app/shared/common/directives/dynamic-control.directive";
import { DialogModule } from "@app/shared/services/dialog/dialog.module";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { ButtonModule } from "@app/shared/components/ui/button/button.module";
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { InfoSectionModule } from "@app/shared/components/info-section/info-section.module";
import { ChapterModule } from "@app/shared/components/chapter/chapter.module";
import { NavigationHeaderModule } from "@app/shared/components/headers/navigation-header/navigation-header.module";
import { GetStepIndexDataPipe } from "@app/home/pages/step/pipes/get-step-index-data.pipe";
import { GetSectionIndexDataPipe } from "@app/home/pages/step/pipes/get-section-index-data.pipe";
import { TranslocoModule } from "@ngneat/transloco";
import { AreAllCompletedModule } from "@app/shared/common/pipes/are-all-completed/are-all-completed.module";


@NgModule({
  declarations: [
    StepComponent,
    GetStepInputsPipe,
    ToDatePipe,
    DynamicControlDirective,
    GetStepIndexDataPipe,
    GetSectionIndexDataPipe
  ],
  providers: [GetStepInputsPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: StepComponent,
      }
    ]),
    FooterButtonsModule,
    DynamicControlFromInputModule,
    DialogModule,
    SvgIconModule,
    ButtonModule,
    InputSectionModule,
    InfoSectionModule,
    ChapterModule,
    NavigationHeaderModule,
    TranslocoModule,
    AreAllCompletedModule
  ]
})
export class StepModule { }
