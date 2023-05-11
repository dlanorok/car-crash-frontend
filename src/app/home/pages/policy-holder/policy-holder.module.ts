import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyHolderComponent } from './policy-holder.component';
import { ApiModule } from "../../../shared/api/api.module";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { MainLayoutComponent } from "../../../shared/layout/main-layout.component";


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
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: PolicyHolderComponent
          }
        ]
      }
    ]),
    TranslocoModule
  ]
})
export class PolicyHolderModule { }
