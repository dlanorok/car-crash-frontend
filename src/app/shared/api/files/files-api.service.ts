import { inject, Injectable } from '@angular/core';
import { ApiModule } from "../api.module";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { UploadedFile } from "../../common/uploaded-file";

@Injectable({
  providedIn: ApiModule
})
export class FilesApiService {
  endpoint = `/api/v1/files/`;

  protected readonly httpClient: HttpClient = inject(HttpClient);

  uploadFile(file: File): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<{id: number, file: string}>(`${this.endpoint}`, formData)
      .pipe(
        map((data: {id: number, file: string}) =>
          ({
            fileId: data.id,
            uploadUrl: data.file,
          } as { fileId: number; uploadUrl: string }),)
      );
  }
}
