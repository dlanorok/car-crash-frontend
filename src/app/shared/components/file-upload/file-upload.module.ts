import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { ApiModule } from "../../api/api.module";
import { ImagesModule } from "@app/shared/common/directives/images/images.module";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { ButtonModule } from "@app/shared/components/ui/button/button.module";
import { FileListRendererComponent } from "@app/shared/components/file-upload/internal/file-list-renderer/file-list-renderer.component";
import { SizeToBytesPipe } from "@app/shared/components/file-upload/internal/file-list-renderer/size-to-bytes.pipe";
import { TranslocoModule } from "@ngneat/transloco";


@NgModule({
  declarations: [
    FileUploadComponent,
    FileListRendererComponent,
    SizeToBytesPipe
  ],
  imports: [
    CommonModule,
    ApiModule,
    ImagesModule,
    SvgIconModule,
    ButtonModule,
    TranslocoModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
