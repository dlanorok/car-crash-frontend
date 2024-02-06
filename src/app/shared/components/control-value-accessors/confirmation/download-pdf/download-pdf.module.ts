import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadPdfComponent } from './download-pdf.component';
import { TranslocoModule } from "@ngneat/transloco";
import { ChapterModule } from "@app/shared/components/chapter/chapter.module";


@NgModule({
  declarations: [
    DownloadPdfComponent
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    ChapterModule
  ]
})
export class DownloadPdfModule { }
