import { BaseModel } from "./base.model";

export class DriverModel extends BaseModel {
  name?: string;
  surname?: string;
  address?: string;
  driving_licence_number?: string;
  driving_licence_valid_to?: string;

  car!: number;

  constructor(data?: any) {
    super(data);

    if (data['car']) {
      this.id = data['car'];
    }
  }
}
