import { BaseModel } from "./base.model";


export class PolicyHolderModel extends BaseModel {
  address?: string;
  country_code?: string;
  email?: string;
  name?: string;
  post_number?: string;
  surname?: string;

  car?: string;
}
