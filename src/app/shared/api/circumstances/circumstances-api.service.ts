import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { CircumstanceModel } from "../../models/circumstance.model";

@Injectable({
  providedIn: ApiModule
})
export class CircumstancesApiService extends BaseApiService<CircumstanceModel>{
  endpoint = `/api/v1/circumstances/`
  model = CircumstanceModel;
}
