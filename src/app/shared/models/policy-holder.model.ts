import { BaseModel } from "./base.model";

export interface PolicyHolder {
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  post_number?: string;
  country_code?: string;
}

export class PolicyHolderModel extends BaseModel implements PolicyHolder {
  address?: string;
  country_code?: string;
  email?: string;
  name?: string;
  post_number?: string;
  surname?: string;
}
