import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyHolderComponent } from './policy-holder.component';
import { ApiModule } from "../../../shared/api/api.module";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    PolicyHolderComponent
  ],
  imports: [
    CommonModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: PolicyHolderComponent
      }
    ])
  ]
})
export class PolicyHolderModule { }
