import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from "@app/shared/services/confirm/confirm.service";
import { DialogModule } from "@app/shared/services/dialog/dialog.module";



@NgModule({
  declarations: [],
  imports: [CommonModule, DialogModule],
})
export class BrowserConfirmModule {
  static forRoot(): ModuleWithProviders<BrowserConfirmModule> {
    return {
      ngModule: BrowserConfirmModule,
      providers: [ConfirmService],
    };
  }
}
