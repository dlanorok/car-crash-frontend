import { BaseModel } from "./base.model";
import { QuestionnaireData } from "@app/home/pages/crash/flow.definition";


export class QuestionnaireModel extends BaseModel {
  creator!: string;
  data!: QuestionnaireData;
}
