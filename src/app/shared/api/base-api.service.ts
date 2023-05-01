import { inject, Injectable, Type } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable()
export abstract class BaseApiService<T> {
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
    return this.httpClient.get(`${this.endpoint}${id}`)
      .pipe(
        map((data) => new this.model(data))
      );
  }
}
