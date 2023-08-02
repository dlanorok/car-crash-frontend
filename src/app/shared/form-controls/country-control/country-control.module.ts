import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryControlComponent } from './country-control.component';



@NgModule({
  declarations: [CountryControlComponent],
  imports: [CommonModule],
  exports: [CountryControlComponent]
})
export class CountryControlModule { }
