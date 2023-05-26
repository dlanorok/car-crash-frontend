import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibleDamageSelectorComponent } from './visible-damage-selector.component';



@NgModule({
    declarations: [
        VisibleDamageSelectorComponent
    ],
    exports: [
        VisibleDamageSelectorComponent
    ],
    imports: [
        CommonModule
    ]
})
export class VisibleDamageSelectorModule { }
