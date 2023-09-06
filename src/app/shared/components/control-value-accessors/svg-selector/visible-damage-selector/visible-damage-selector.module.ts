import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibleDamageSelectorComponent } from './visible-damage-selector.component';
import { FileUploadModule } from "@app/shared/components/file-upload/file-upload.module";



@NgModule({
    declarations: [
        VisibleDamageSelectorComponent
    ],
    exports: [
        VisibleDamageSelectorComponent
    ],
  imports: [
    CommonModule,
    FileUploadModule
  ]
})
export class VisibleDamageSelectorModule { }
