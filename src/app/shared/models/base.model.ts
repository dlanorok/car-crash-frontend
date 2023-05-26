export class BaseModel {
  id!: number;
  revision!: string;

  // eslint-disable-next-line
  constructor(data?: any) {
    Object.assign(this, data);
  }
}
