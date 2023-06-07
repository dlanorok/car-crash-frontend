import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrComponentComponent } from "./ocr-component.component";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";



@NgModule({
    declarations: [
        OcrComponentComponent
    ],
    exports: [
      OcrComponentComponent
    ],
    imports: [
        CommonModule,
        SvgIconModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OcrComponentModule { }
