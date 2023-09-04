import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfPreviewComponent } from "@app/home/pages/pdf-preview/pdf-preview.component";
import { RouterModule } from "@angular/router";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";


@NgModule({
  declarations: [PdfPreviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: PdfPreviewComponent,
      }
    ]),
    NgxExtendedPdfViewerModule,
    FooterButtonsModule,
  ],
  exports: [PdfPreviewComponent]
})
export class PdfPreviewModule { }
