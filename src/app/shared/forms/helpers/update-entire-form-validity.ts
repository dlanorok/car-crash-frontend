import { UntypedFormGroup } from '@angular/forms';

export function updateEntireFormValidity(formGroup: UntypedFormGroup): void {
  for (const i of Object.keys(formGroup.controls)) {
    formGroup.controls[i].markAsTouched();
    formGroup.controls[i].markAsDirty();
    formGroup.controls[i].updateValueAndValidity();

    if (formGroup.controls[i] instanceof UntypedFormGroup) {
      updateEntireFormValidity(formGroup.controls[i] as UntypedFormGroup);
    }
  }
}
