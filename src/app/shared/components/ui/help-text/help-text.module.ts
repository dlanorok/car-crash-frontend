import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpTextComponent } from './help-text.component';



@NgModule({
  declarations: [
    HelpTextComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [HelpTextComponent]
})
export class HelpTextModule { }
