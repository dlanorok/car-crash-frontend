import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiModule } from "@app/shared/api/api.module";

@Injectable({
  providedIn: ApiModule
})
export class CommonApiService {
  protected readonly httpClient: HttpClient = inject(HttpClient);

  sendSms(content: string, recipient: string): Observable<any> {
    return this.httpClient.post('/api/v1/send-sms/', {content: content, recipient: recipient});
  }
}
