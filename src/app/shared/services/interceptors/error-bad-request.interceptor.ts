import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { BaseErrorInterceptor } from "@app/shared/services/interceptors/error-base.interceptor";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ErrorBadRequestInterceptor extends BaseErrorInterceptor {
  readonly httpStatusCode: HttpStatusCode = HttpStatusCode.BadRequest as const;
  readonly errorType: null = null;

  constructor(
    private readonly toastService: ToastrService,
    private readonly translateService: TranslocoService,
    private readonly errorHandler: ErrorHandler,
  ) {
    super();
  }

  protected handleError(err: HttpErrorResponse): Observable<any> {
    this.toastService.error(err.error);
    this.errorHandler.handleError(err);
    return super.emptyResponse();
  }
}
