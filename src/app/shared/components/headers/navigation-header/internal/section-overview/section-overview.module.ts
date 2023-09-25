import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionOverviewComponent } from './section-overview.component';
import { GetStateFromSectionModule } from "@app/shared/common/pipes/get-state-from-section/get-state-from-section.module";
import { AmICreatorModule } from "@app/shared/common/pipes/am-i-creator/am-i-creator.module";
import { RouterModule } from "@angular/router";
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { TranslocoModule } from "@ngneat/transloco";



@NgModule({
  declarations: [
    SectionOverviewComponent
  ],
  exports: [
    SectionOverviewComponent
  ],
  imports: [
    CommonModule,
    GetStateFromSectionModule,
    AmICreatorModule,
    RouterModule,
    SvgIconModule,
    TranslocoModule
  ]
})
export class SectionOverviewModule { }
