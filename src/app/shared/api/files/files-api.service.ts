import { inject, Injectable } from '@angular/core';
import { ApiModule } from "../api.module";
import { HttpClient, HttpEvent } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ImageModel } from "@app/shared/models/image.model";

@Injectable({
  providedIn: ApiModule
})
export class FilesApiService {
  endpoint = `/api/v1/files/`;

  protected readonly httpClient: HttpClient = inject(HttpClient);

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    return this.httpClient.post<HttpEvent<any>>(`${this.endpoint}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getFileData(fileId: number): Observable<ImageModel> {
    return this.httpClient.get<HttpEvent<ImageModel>>(`${this.endpoint}${fileId}/`).pipe(
      map((data) => new ImageModel(data)),
    );
  }

  deleteFile(fileId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.endpoint}${fileId}/`);
  }
}
