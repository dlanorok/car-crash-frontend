import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationHeaderComponent } from './navigation-header.component';
import { SvgIconModule } from "@app/shared/components/ui/svg-icon/svg-icon.module";
import { AmICreatorModule } from "@app/shared/common/pipes/am-i-creator/am-i-creator.module";
import { TimesModule } from "@app/shared/common/pipes/times/times.module";



@NgModule({
  declarations: [
    NavigationHeaderComponent,
  ],
  imports: [
    CommonModule,
    SvgIconModule,
    AmICreatorModule,
    TimesModule
  ],
  exports: [NavigationHeaderComponent]
})
export class NavigationHeaderModule { }
