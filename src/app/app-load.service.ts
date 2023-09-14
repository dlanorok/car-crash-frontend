import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { createEssentialThemeStyles } from "@app/shared/color-scheme/create-essential-theme-styles";
import { defaultColorScheme } from "@app/shared/color-scheme/constants/default-color-scheme";

@Injectable()
export class AppLoadService {
  constructor(
    @Inject(DOCUMENT) private readonly domDocument: Document,
  ) {}

  initApp(): void {
    this.applyInsuranceStyle();
  }

  private applyInsuranceStyle(): void {
    const style = this.domDocument.createElement('style');
    style.innerHTML = createEssentialThemeStyles(defaultColorScheme);
    this.domDocument.head.appendChild(style);
  }

}
