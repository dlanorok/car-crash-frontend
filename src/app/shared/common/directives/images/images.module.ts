import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDirective } from "@app/shared/common/directives/images/image-directive";

@NgModule({
  declarations: [ImageDirective],
  exports: [ImageDirective],
  imports: [
    CommonModule,
  ],
})
export class ImagesModule {}
