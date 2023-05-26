import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { CarModel } from "../../models/car.model";
import { Observable, tap } from "rxjs";
import { updateCarSuccessful } from "../../../app-state/car/car-action";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: ApiModule
})
export class CarsApiService extends BaseApiService<CarModel>{
  endpoint = `/api/v1/cars/`
  model = CarModel;
}
