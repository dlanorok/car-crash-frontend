import { BaseModel } from "./base.model";

export class Crash extends BaseModel {
  id!: number;
  session_id!: string;

  created_at?: string;
  closed?: boolean;

  cars?: number[];
}
