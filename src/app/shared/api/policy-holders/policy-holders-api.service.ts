import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { PolicyHolderModel } from "../../models/policy-holder.model";

@Injectable({
  providedIn: ApiModule
})
export class PolicyHoldersApiService extends BaseApiService<PolicyHolderModel>{
  endpoint = `/api/v1/policy_holders/`
  model = PolicyHolderModel;
}
