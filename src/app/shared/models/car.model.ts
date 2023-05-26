import { BaseModel } from "./base.model";
import { PolicyHolderModel } from "./policy-holder.model";

export class CarModel extends BaseModel {
  crash!: number;

  registration_plate?: string;
  registration_country?: string;
  car_type?: string
  make_type?: string

  policy_holder?: PolicyHolderModel
  damaged_parts?: string[];
  initial_impact?: string[];
}
