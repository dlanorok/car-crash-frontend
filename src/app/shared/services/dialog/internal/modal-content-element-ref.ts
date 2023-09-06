import { ElementRef, InjectionToken } from '@angular/core';

export interface DialogContent {
  contentElementRef: ElementRef;
  close: () => void;
}

export const DIALOG_CONTENT = new InjectionToken<DialogContent>('MODAL_CONTENT_ELEMENT_REF');
