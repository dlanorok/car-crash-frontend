import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { CarModel } from "../../models/car.model";

@Injectable({
  providedIn: ApiModule
})
export class CarsApiService extends BaseApiService<CarModel>{
  endpoint = `/api/v1/cars/`
  model = CarModel;
}
