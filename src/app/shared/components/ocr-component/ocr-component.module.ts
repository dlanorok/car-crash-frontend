import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrComponentComponent } from "./ocr-component.component";



@NgModule({
    declarations: [
        OcrComponentComponent
    ],
    exports: [
      OcrComponentComponent
    ],
    imports: [
        CommonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OcrComponentModule { }
