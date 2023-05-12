import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormModalData } from "../components/modals/interfaces/form-modal-data";
import { BaseFormComponent } from "../components/forms/base-form.component";
import { BaseFormModalComponent } from "../components/modals/base-form-modal/base-form-modal.component";
import { mergeMap, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalOptions: NgbModalOptions = {
    backdrop: 'static',
    centered: true,
  };

  constructor(private modalService: NgbModal) { }

  open<T, C extends BaseFormComponent<T>, R>(component: any, data: FormModalData<T, C, R> & { setDefaults?(value: T): void}): void {
    const modalRef = this.modalService.open(component, this.modalOptions);
    modalRef.componentInstance.data = data;
    this.observeModalFormSubmit(modalRef, data);
  }

  private observeModalFormSubmit<T, C extends BaseFormComponent<T>, R>(modalRef: NgbModalRef, data: FormModalData<T, C, R>) {
    (modalRef.componentInstance as BaseFormModalComponent<T,C,R>).formSubmit
      .pipe(
        mergeMap((value: T) => {
          modalRef.dismiss();
          return value ? data.afterSubmit$(value) : of(undefined)
        })
      ).subscribe()
  }
}
