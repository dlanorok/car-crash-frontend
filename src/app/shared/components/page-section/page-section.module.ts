import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSectionComponent } from './page-section.component';



@NgModule({
    declarations: [
        PageSectionComponent
    ],
    exports: [
        PageSectionComponent
    ],
    imports: [
        CommonModule
    ]
})
export class PageSectionModule { }
