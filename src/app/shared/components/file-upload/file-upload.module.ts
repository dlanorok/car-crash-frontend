import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { ApiModule } from "../../api/api.module";
import { ImagesModule } from "@app/shared/common/directives/images/images.module";


@NgModule({
  declarations: [
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    ApiModule,
    ImagesModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
