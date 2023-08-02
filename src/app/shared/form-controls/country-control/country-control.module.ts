import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryControlComponent } from './country-control.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [CountryControlComponent],
  imports: [CommonModule, NgSelectModule, FormsModule],
  exports: [CountryControlComponent]
})
export class CountryControlModule { }
