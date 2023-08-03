import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryControlComponent } from './country-control.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { SelectControlModule } from "@app/shared/form-controls/select-control/select-control.module";



@NgModule({
  declarations: [CountryControlComponent],
  imports: [CommonModule, NgSelectModule, FormsModule, SelectControlModule],
  exports: [CountryControlComponent]
})
export class CountryControlModule { }
