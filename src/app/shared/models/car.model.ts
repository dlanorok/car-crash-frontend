import { Crash } from "./crash.model";
import { BaseModel } from "./base.model";
import { PolicyHolderModel } from "./policy-holder.model";

export class CarModel extends BaseModel {
  crash!: Crash;


  registration_plate?: string;
  registration_country?: string;
  car_type?: string
  make_type?: string

  policy_holder?: PolicyHolderModel
}
