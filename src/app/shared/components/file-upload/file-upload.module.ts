import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { ApiModule } from "../../api/api.module";
import { ImagesModule } from "@app/shared/common/directives/images/images.module";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";


@NgModule({
  declarations: [
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    ApiModule,
    ImagesModule,
    SvgIconModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
