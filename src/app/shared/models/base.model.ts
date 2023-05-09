export class BaseModel {
  revision!: string

  constructor(data?: any) {
    Object.assign(this, data);
  }
}
