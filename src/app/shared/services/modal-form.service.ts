import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormModalData } from "../components/modals/interfaces/form-modal-data";
import { BaseFormComponent } from "../components/forms/base-form.component";
import { BaseFormModalComponent } from "../components/modals/base-form-modal/base-form-modal.component";
import { EMPTY, first, mergeMap, tap } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleApiValidationErrors } from "../components/forms/common/helpers/handle-api-validation-errors";

@Injectable({
  providedIn: 'root'
})
export class ModalFormService {
  private modalOptions: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
  };

  constructor(private modalService: NgbModal) { }

  // eslint-disable-next-line
  open<T, C extends BaseFormComponent<T>, R>(component: any, data: FormModalData<T, C, R> & { setDefaults?(value: T): void}): void {
    const modalRef = this.modalService.open(component, this.modalOptions);
    modalRef.componentInstance.data = data;
    this.observeModalFormSubmit(modalRef, data);
  }

  private observeModalFormSubmit<T, C extends BaseFormComponent<T>, R>(modalRef: NgbModalRef, data: FormModalData<T, C, R>) {
    (modalRef.componentInstance as BaseFormModalComponent<T,C,R>).formSubmit
      .pipe(
        mergeMap((value: T) => {
          return data.afterSubmit$(value)
            .pipe(
              first(),
              handleApiValidationErrors(modalRef.componentInstance as BaseFormModalComponent<T, C, R>),
              catchError(() => {
                return EMPTY;
              }),
            );
        }),
        tap(() => {
          modalRef.dismiss();
        })
      ).subscribe();
  }
}
