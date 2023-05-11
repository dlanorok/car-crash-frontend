import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { DriverModel } from "../../models/driver.model";

@Injectable({
  providedIn: ApiModule
})
export class DriversApiService extends BaseApiService<DriverModel>{
  endpoint = `/api/v1/drivers/`
  model = DriverModel;
}
