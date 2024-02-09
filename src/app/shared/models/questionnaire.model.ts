import { BaseModel } from "./base.model";
import { QuestionnaireData } from "@app/home/pages/crash/flow.definition";
import { CarModel } from "@app/shared/models/car.model";
import { CrashModel } from "@app/shared/models/crash.model";


export class QuestionnaireModel extends BaseModel {
  creator!: string;
  data!: QuestionnaireData;
  crash_confirmed?: boolean;
  completed?: boolean;
  car?: CarModel;
  crash!: CrashModel;
}
