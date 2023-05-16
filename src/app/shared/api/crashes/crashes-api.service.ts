import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { CrashModel } from "../../models/crash.model";
import { ApiModule } from "../api.module";

@Injectable({
  providedIn: ApiModule
})
export class CrashesApiService extends BaseApiService<CrashModel>{
  endpoint = `/api/v1/crashes/`
  model = CrashModel;
}
