import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfInitialImpactComponent } from './point-of-initial-impact.component';

@NgModule({
    declarations: [
        PointOfInitialImpactComponent
    ],
    exports: [
        PointOfInitialImpactComponent
    ],
    imports: [
        CommonModule
    ]
})
export class PointOfInitialImpactModule { }
