import { BaseModel } from "./base.model";

export class DriverModel extends BaseModel {
  name?: string;
  surname?: string;
  address?: string;
  country?: string;
  driving_licence_number?: string;
  driving_licence_category?: string;
  date_of_birth?: string;
  driving_licence_valid_to?: string;
  phone_number?: string;
  email?: string;

  car!: number;

  constructor(data?: any) {
    super(data);

    if (data['car']) {
      this.id = data['car'];
    }
  }
}
