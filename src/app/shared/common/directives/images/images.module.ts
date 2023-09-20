import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDirective } from "@app/shared/common/directives/images/image-directive";
import { ImagePreviewDirective } from "@app/shared/common/directives/images/image-preview.directive";

@NgModule({
  declarations: [ImageDirective, ImagePreviewDirective],
  exports: [ImageDirective, ImagePreviewDirective],
  imports: [
    CommonModule,
  ],
})
export class ImagesModule {}
