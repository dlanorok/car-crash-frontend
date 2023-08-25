import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfInitialImpactComponent } from './point-of-initial-impact.component';
import { FileUploadModule } from "@app/shared/components/file-upload/file-upload.module";
import { FormErrorsModule } from "@app/shared/components/forms/shell/form-errors/form-errors.module";

@NgModule({
  declarations: [
    PointOfInitialImpactComponent
  ],
  exports: [
    PointOfInitialImpactComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    FormErrorsModule
  ]
})
export class PointOfInitialImpactModule {
}
