import { BaseModel } from "./base.model";

export class Crash extends BaseModel {
  session_id!: string;

  created_at?: string;
  closed?: boolean;

  cars?: number[];
}
