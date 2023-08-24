export class ImageModel {
  id!: number;
  file!: string;
  name?: string;

  constructor(data?: any) {
    Object.assign(this, data);
  }
}
