export class BaseModel {
  id!: number;
  revision!: string

  constructor(data?: any) {
    Object.assign(this, data);
  }
}
