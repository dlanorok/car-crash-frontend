export class FileModel {
  id!: number;
  file!: string;
  file_name?: string;
  file_size?: string;

  constructor(data?: any) {
    Object.assign(this, data);
  }
}
