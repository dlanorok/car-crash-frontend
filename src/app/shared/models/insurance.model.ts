import { BaseModel } from "./base.model";

export class InsuranceModel extends BaseModel {
  car!: number;

  name?: string;
  policy_number?: string;
  agent?: string;
  green_card?: string;
  valid_until?: string;
  damage_insured?: boolean;

  constructor(data?: any) {
    super(data);

    if (data['car']) {
      this.id = data['car'];
    }
  }
}
