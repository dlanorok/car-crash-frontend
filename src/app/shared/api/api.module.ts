import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HttpApiInterceptor } from "@app/shared/services/interceptors/http-api.interceptor";
import { ErrorBadRequestInterceptor } from "@app/shared/services/interceptors/error-bad-request.interceptor";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpApiInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorBadRequestInterceptor,
      multi: true
    },
  ]
})
export class ApiModule { }
