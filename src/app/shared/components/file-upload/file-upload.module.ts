import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { ApiModule } from "../../api/api.module";



@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    ApiModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
