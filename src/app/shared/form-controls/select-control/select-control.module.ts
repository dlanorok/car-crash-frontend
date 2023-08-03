import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { SelectControlComponent } from "@app/shared/form-controls/select-control/select-control.component";


@NgModule({
  declarations: [SelectControlComponent],
  imports: [CommonModule, NgSelectModule, FormsModule],
  exports: [SelectControlComponent]
})
export class SelectControlModule { }
