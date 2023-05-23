import { BaseModel } from "./base.model";


export class CircumstanceModel extends BaseModel {
  parked_stopped?: boolean;
  leaving_parking_opening_door?: boolean;
  entering_parking?: boolean;
  emerging_from_car_park?: boolean;
  entering_car_park?: boolean;
  entering_roundabout?: boolean;
  circulating_roundabout?: boolean;
  rear_same_direction?: boolean;
  same_direction_different_lane?: boolean;
  changing_lanes?: boolean;
  overtaking?: boolean;
  turning_right?: boolean;
  turning_left?: boolean;
  reversing?: boolean;
  driving_on_opposite_lane?: boolean;
  from_right_crossing?: boolean;
  disregarding_right_of_way_red_light?: boolean;

  car?: string;
}
