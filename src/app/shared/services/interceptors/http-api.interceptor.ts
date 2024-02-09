import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageItem } from "@app/shared/common/enumerators/storage";


@Injectable()
export class HttpApiInterceptor implements HttpInterceptor {

  private readonly authHeaderName: string = 'X-SESSION';
  private readonly authTokenType: string = 'Session';
  private readonly acceptLanguage: string = 'Accept-Language';
  private readonly timeZoneHeader: string = 'Timezone';

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = this.setAuthHeader(request.headers);

    request = request.clone({
      headers: headers,
      withCredentials: true
    });

    return next.handle(request);
  }

  private setAuthHeader(headers: HttpHeaders): HttpHeaders {
    const token = localStorage.getItem(StorageItem.sessionId);
    if (token) {
      headers = headers.set(this.authHeaderName, `${this.authTokenType} ${token}`);
    }

    headers = headers.set(this.acceptLanguage, 'sl');
    headers = headers.set(this.timeZoneHeader, Intl.DateTimeFormat().resolvedOptions().timeZone);

    return headers;
  }
}
