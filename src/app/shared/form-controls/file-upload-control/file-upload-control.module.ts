import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadControlComponent } from "@app/shared/form-controls/file-upload-control/file-upload-control.component";
import { FileUploadModule } from "@app/shared/components/file-upload/file-upload.module";
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";



@NgModule({
  declarations: [
    FileUploadControlComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    FormErrorsModule
  ]
})
export class FileUploadControlModule { }
