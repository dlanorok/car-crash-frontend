import { BaseModel } from "./base.model";

export class InsuranceModel extends BaseModel {
  car?: string;

  name?: string;
  policy_number?: string;
  agent?: string;
  green_card?: string;
  valid_until?: string;
  damaged_insured?: boolean;
}
