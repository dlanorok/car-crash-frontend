import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfPreviewComponent } from "@app/shared/components/pdf-preview/pdf-preview.component";


@NgModule({
  declarations: [PdfPreviewComponent],
  imports: [
    CommonModule,
  ],
  exports: [PdfPreviewComponent]
})
export class PdfPreviewModule { }
