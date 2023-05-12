import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { InsuranceModel } from "../../models/insurance.model";

@Injectable({
  providedIn: ApiModule
})
export class InsurancesApiService extends BaseApiService<InsuranceModel>{
  endpoint = `/api/v1/insurances/`
  model = InsuranceModel;
}
