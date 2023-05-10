import { Crash } from "./crash.model";

export class CarModel {
  id!: number;
  crash!: Crash;

  policy_holder: any

  constructor(data: any) {
    Object.assign(this, data);
  }
}
