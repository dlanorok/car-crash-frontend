import { inject, Injectable } from '@angular/core';
import { ApiModule } from "../api.module";
import { HttpClient } from "@angular/common/http";
import {
  DocumentReaderApi,
  Configuration, ProcessRequest,
} from '@regulaforensics/document-reader-webclient';
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: ApiModule
})
export class RegularForensicsApi {
  protected readonly httpClient: HttpClient = inject(HttpClient);
  api: DocumentReaderApi;

  constructor() {
    const configuration = new Configuration({ basePath: environment.regulaUrl });
    this.api = new DocumentReaderApi(configuration);
  }

  process(request: ProcessRequest) {
    return this.api.process(request);
  }
}
