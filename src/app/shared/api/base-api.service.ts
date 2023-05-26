import { inject, Injectable, Type } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { BaseModel } from "../models/base.model";

@Injectable()
export abstract class BaseApiService<T extends BaseModel> {
  abstract endpoint: string
  abstract model: Type<T>;

  protected readonly httpClient: HttpClient = inject(HttpClient);

  create(entity: T): Observable<T> {
    return this.httpClient.post(this.endpoint, entity)
      .pipe(
        map((data) => new this.model(data))
      );
  }

  getSingle(id: number | string): Observable<T> {
    return this.httpClient.get(`${this.endpoint}${id}/`)
      .pipe(
        map((data) => new this.model(data))
      );
  }

  put(entity: T): Observable<T> {
    return this.httpClient.put(`${this.endpoint}${entity.id}/`, entity)
      .pipe(
        map((data) => new this.model(data))
      );
  }

  patch(entity: T): Observable<T> {
    return this.httpClient.patch(`${this.endpoint}${entity.id}/`, entity)
      .pipe(
        map((data) => new this.model(data))
      );
  }

  delete(id: number | string): Observable<any> {
    return this.httpClient.delete(`${this.endpoint}${id}/`)
  }

  getList(): Observable<T[]> {
    return this.httpClient.get(`${this.endpoint}`)
      .pipe(
        map((models) => {
          if (!Array.isArray(models)) {
            return [];
          }

          return models.map(model => {
            return new this.model(model)
          })
        })
      );
  }
}
