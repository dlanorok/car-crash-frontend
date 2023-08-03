import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DamagedPartsComponent } from './damaged-parts.component';
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { RouterModule } from "@angular/router";
import { VisibleDamageSelectorModule } from "@app/shared/components/control-value-accessors/svg-selector/visible-damage-selector/visible-damage-selector.module";



@NgModule({
  declarations: [
    DamagedPartsComponent
  ],
  imports: [
    CommonModule,
    FooterButtonsModule,
    VisibleDamageSelectorModule,
    RouterModule.forChild([
      {
        path: "",
        component: DamagedPartsComponent,
      },
    ]),
  ]
})
export class DamagedPartsModule { }
