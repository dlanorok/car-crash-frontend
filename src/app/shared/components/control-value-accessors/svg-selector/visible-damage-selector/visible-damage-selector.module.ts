import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibleDamageSelectorComponent } from './visible-damage-selector.component';
import { FileUploadModule } from "@app/shared/components/file-upload/file-upload.module";
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";
import { InputSectionModule } from "@app/shared/components/input-section/input-section.module";
import { TranslocoModule } from "@ngneat/transloco";
import { IncludesModule } from "@app/shared/common/pipes/includes/includes.module";



@NgModule({
    declarations: [
        VisibleDamageSelectorComponent
    ],
    exports: [
        VisibleDamageSelectorComponent
    ],
  imports: [
    CommonModule,
    FileUploadModule,
    FormErrorsModule,
    InputSectionModule,
    TranslocoModule,
    IncludesModule
  ]
})
export class VisibleDamageSelectorModule { }
