import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfInitialImpactComponent } from './point-of-initial-impact.component';
import { FileUploadModule } from "@app/shared/components/file-upload/file-upload.module";

@NgModule({
    declarations: [
        PointOfInitialImpactComponent
    ],
    exports: [
        PointOfInitialImpactComponent
    ],
  imports: [
    CommonModule,
    FileUploadModule
  ]
})
export class PointOfInitialImpactModule { }
