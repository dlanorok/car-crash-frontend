export class BaseModel {
  id!: number;
  revision!: number;
  validate?: boolean;
  state!: ModelState;

  // eslint-disable-next-line
  constructor(data?: any) {
    Object.assign(this, data);
  }
}

export enum ModelState {
  partial = "P",
  validated = 'V',
  empty = 'E'
}
