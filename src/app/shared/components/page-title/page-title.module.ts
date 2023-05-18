import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from './page-title.component';
import { TranslocoModule } from "@ngneat/transloco";



@NgModule({
    declarations: [
        PageTitleComponent
    ],
    exports: [
        PageTitleComponent
    ],
  imports: [
    CommonModule,
    TranslocoModule
  ]
})
export class PageTitleModule { }
