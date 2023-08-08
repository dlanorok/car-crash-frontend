import { ComponentRef } from '@angular/core';

export const writeComponentRefChanges = <T>(componentRef: ComponentRef<T>, values: Partial<T>): void =>
  Object.entries(values)
    .filter(([propertyName]) => Object.prototype.hasOwnProperty.call(values, propertyName))
    .forEach(([propertyName, value]) => componentRef.setInput(propertyName, value));
