import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export abstract class BaseErrorInterceptor implements HttpInterceptor {
  abstract readonly httpStatusCode: HttpStatusCode;

  // Ability to match only specific error type. When null, error type is not validated (and only status code is).
  abstract readonly errorType: string | null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => this.catchError(err)));
  }

  protected abstract handleError(err: HttpErrorResponse): Observable<any>;

  protected emptyResponse(): Observable<any> {
    return EMPTY;
  }

  protected shouldCatchError(err: Error): err is HttpErrorResponse {
    return (
      err instanceof HttpErrorResponse &&
      err.status === this.httpStatusCode &&
      (!this.errorType || (!!this.errorType && this.errorType === err.error?.type))
    );
  }

  protected catchError(err: Error, config?: any): Observable<any> {
    if (!this.shouldCatchError(err)) {
      return throwError(err);
    }
    return this.handleError(err);
  }
}
