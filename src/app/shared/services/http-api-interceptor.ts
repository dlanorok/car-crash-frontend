import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class HttpApiInterceptor implements HttpInterceptor {

  private readonly authHeaderName: string = 'X-SESSION';
  private readonly authTokenType: string = 'Session';

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = this.setAuthHeader(request.headers);

    request = request.clone({
      headers: headers
    });

    return next.handle(request);
  }

  private setAuthHeader(headers: HttpHeaders): HttpHeaders {
    const token = localStorage.getItem('session_id')
    headers = headers.set(this.authHeaderName, `${this.authTokenType} ${token}`);

    return headers;
  }
}
