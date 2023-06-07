import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DamagedPartsComponent } from './damaged-parts.component';
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { VisibleDamageSelectorModule } from "@app/shared/components/ui/visible-damage-selector/visible-damage-selector.module";
import { RouterModule } from "@angular/router";



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
