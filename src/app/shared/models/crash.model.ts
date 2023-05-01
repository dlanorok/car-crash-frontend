export class Crash {
  id!: number;
  created_at!: string;
  session_id!: string;
  closed!: boolean;

  constructor(data?: any) {
    Object.assign(this, data);
  }
}
