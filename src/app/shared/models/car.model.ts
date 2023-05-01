import { Crash } from "./crash.model";

export class Car {
  id!: number;
  crash!: Crash;
  driver?: any;
  name?: string;
  registration_plate?: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
