import { Observable } from 'rxjs';

export interface ReturnDialogData<C> {
  afterClose$: Observable<unknown>;
  componentInstance: C;
  close: () => void;
}
