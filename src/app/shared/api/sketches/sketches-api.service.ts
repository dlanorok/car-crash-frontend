import { Injectable } from '@angular/core';
import { BaseApiService } from "../base-api.service";
import { ApiModule } from "../api.module";
import { SketchModel } from "@app/shared/models/sketch.model";

@Injectable({
  providedIn: ApiModule
})
export class SketchesApiService extends BaseApiService<SketchModel>{
  endpoint = `/api/v1/sketches/`;
  model = SketchModel;
}
