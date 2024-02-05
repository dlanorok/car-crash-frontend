import { BaseModel } from "./base.model";
import { QuestionnaireData } from "@app/home/pages/crash/flow.definition";
import { CarModel } from "@app/shared/models/car.model";


export class QuestionnaireModel extends BaseModel {
  creator!: string;
  data!: QuestionnaireData;
  crash_confirmed?: boolean;
  completed?: boolean;
  car?: CarModel;
}
