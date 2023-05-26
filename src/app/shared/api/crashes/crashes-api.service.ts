import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { CrashModel } from "../../models/crash.model";
import { ApiModule } from "../api.module";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: ApiModule
})
export class CrashesApiService extends BaseApiService<CrashModel>{
  endpoint = `/api/v1/crashes/`;
  model = CrashModel;

  override put(entity: CrashModel): Observable<CrashModel> {
    return this.httpClient.put(`${this.endpoint}${entity.session_id}/`, entity)
      .pipe(
        map((data) => new this.model(data))
      );
  }
}
