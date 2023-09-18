import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from "./svg-icon.component";
import { IconSpriteModule } from "ng-svg-icon-sprite";



@NgModule({
  declarations: [SvgIconComponent],
  exports: [SvgIconComponent],
  imports: [
    CommonModule,
    IconSpriteModule
  ]
})
export class SvgIconModule { }
