import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { CrashModel } from "../../models/crash.model";
import { ApiModule } from "../api.module";
import { map, Observable } from "rxjs";
import { CarModel } from "@app/shared/models/car.model";

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

  generatePdf(entity: CrashModel): Observable<any> {
    return this.httpClient.post(`${this.endpoint}${entity.session_id}/generate_pdf/`, {})
      .pipe(
        map((data) => new this.model(data))
      );
  }

  confirmCrash(entity: CrashModel): Observable<any> {
    return this.httpClient.post(`${this.endpoint}${entity.session_id}/confirm_crash/`, {})
      .pipe(
        map((data) => new this.model(data))
      );
  }

  getSummary(entity: CrashModel): Observable<CarModel[]> {
    return this.httpClient.get(`${this.endpoint}${entity.session_id}/summary/`, {})
      .pipe(
        map((models) => {
          if (!Array.isArray(models)) {
            return [];
          }

          return models.map(model => {
            return new CarModel(model);
          });
        })
      );
  }
}
