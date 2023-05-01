import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { Crash } from "../../models/crash.model";
import { ApiModule } from "../api.module";

@Injectable({
  providedIn: ApiModule
})
export class CrashesApiService extends BaseApiService<Crash>{
  endpoint = `/api/v1/crashes/`
  model = Crash;
}
