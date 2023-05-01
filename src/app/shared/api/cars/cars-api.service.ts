import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { Car } from "../../models/car.model";

@Injectable({
  providedIn: ApiModule
})
export class CarsApiService extends BaseApiService<Car>{
  endpoint = `/api/v1/cars/`
  model = Car;
}
