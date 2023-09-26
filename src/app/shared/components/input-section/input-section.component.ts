import { Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
import { take } from "rxjs";
import { HelpTextComponent } from "@app/shared/components/ui/help-text/help-text.component";
import { HelpTextModule } from "@app/shared/components/ui/help-text/help-text.module";
import { DialogService } from "@app/shared/services/dialog/dialog.service";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: 'app-input-section',
  templateUrl: './input-section.component.html',
  styleUrls: ['./input-section.component.scss']
})
export class InputSectionComponent {
  protected readonly dialogService: DialogService = inject(DialogService);
  protected readonly injector: Injector = inject(Injector);
  protected readonly translateService: TranslocoService = inject(TranslocoService);

  @Input() disabledButton?: boolean;
  @Input() buttonName!: string;
  @Input() title?: string;
  @Input() info?: string;

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<void> = new EventEmitter<void>();

  openInfoModal() {
    this.dialogService.openDialog({
      componentData: {
        component: HelpTextComponent,
        module: HelpTextModule,
        parentInjector: this.injector
      },
      componentParams: {
        infoText: this.info
      },
      options: {
        size: 'xl',
        centered: true
      },
      isClosable: true,
      title$: this.translateService.selectTranslate('car-crash.info-section.modal.title')
    }).pipe(take(1)).subscribe();
  }

  handleNext() {
    if(!this.disabledButton) {
      this.next.next();
    }
  }

}
