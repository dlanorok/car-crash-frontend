import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsAsync$Pipe } from "@app/shared/common/pipes/as-async/as-async.pipe";



@NgModule({
  declarations: [AsAsync$Pipe],
  imports: [
    CommonModule
  ],
  exports: [AsAsync$Pipe]
})
export class AsAsyncModule { }
