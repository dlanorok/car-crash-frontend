import { BaseModel } from "./base.model";

export class CrashModel extends BaseModel {
  session_id!: string;

  created_at?: string;
  closed?: boolean;

  date_of_accident!: string;
  country!: string;
  place!: string;
  injuries!: boolean;
  vehicle_material_damage!: boolean;
  other_material_damage!: boolean;


  cars?: number[];
}
