import { Component } from "@angular/core";
import { FooterButton } from "@app/shared/components/footer-buttons/footer-buttons.component";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  template: '',
})
export abstract class BaseFooterComponent {
  footerButtons: FooterButton[] = [
    {
      name$: this.translateService.selectTranslate('car-crash.shared.button.back'),
      action: () => {
        this.previous();
      },
      icon: 'bi-chevron-left'
    },
    {
      name$: this.translateService.selectTranslate('car-crash.shared.button.overview'),
      action: () => {
        const sessionId = localStorage.getItem(StorageItem.sessionId);
        return this.router.navigate([`/crash/${sessionId}`]);
      },
      icon: 'bi-house'
    },
    {
      name$: this.translateService.selectTranslate('car-crash.shared.button.next'),
      action: () => {
        this.next();
      },
      icon: 'bi-chevron-right'
    },
  ];

  constructor(
    protected readonly router: Router,
    protected readonly translateService: TranslocoService
  ) {
  }

  abstract next(): void;
  abstract previous(): void;
}
