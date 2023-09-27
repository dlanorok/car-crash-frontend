import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileListRendererComponent } from "@app/shared/components/file-upload/internal/file-list-renderer/file-list-renderer.component";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { SizeToBytesPipe } from "@app/shared/components/file-upload/internal/file-list-renderer/size-to-bytes.pipe";
import { ImagesModule } from "@app/shared/common/directives/images/images.module";
import { LottieModule } from "ngx-lottie";

@NgModule({
  declarations: [
    FileListRendererComponent,
    SizeToBytesPipe
  ],
  imports: [
    CommonModule,
    SvgIconModule,
    ImagesModule,
    LottieModule
  ],
  exports: [FileListRendererComponent]
})
export class FileListRendererModule { }
