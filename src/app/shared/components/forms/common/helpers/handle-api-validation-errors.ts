import { EMPTY, MonoTypeOperatorFunction, pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseFormComponent } from "../../base-form.component";

export const handleApiValidationErrors = <T, C>(
  formComponent: Pick<BaseFormComponent<C>, 'parseApiValidationError'>
): MonoTypeOperatorFunction<T> =>
  pipe(
    catchError(err => {
      if (formComponent && err.error && err.error instanceof Object) {
        formComponent.parseApiValidationError(err);
        return EMPTY;
      }
      return throwError(err);
    }),
  );
