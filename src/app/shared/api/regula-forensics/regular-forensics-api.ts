import { inject, Injectable } from '@angular/core';
import { ApiModule } from "../api.module";
import { HttpClient } from "@angular/common/http";
import {
  DocumentReaderApi,
  Configuration,
} from '@regulaforensics/document-reader-webclient';
import { ProcessRequest } from "@regulaforensics/document-reader-webclient/src/ext/process-request";

@Injectable({
  providedIn: ApiModule
})
export class RegularForensicsApi {
  protected readonly httpClient: HttpClient = inject(HttpClient);
  api: DocumentReaderApi;

  constructor() {
    const configuration = new Configuration({ basePath: '/regula' });
    this.api = new DocumentReaderApi(configuration);
  }

  process(request: ProcessRequest) {
    return this.api.process(request);
  }
}
