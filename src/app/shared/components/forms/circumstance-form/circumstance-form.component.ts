import { Component } from '@angular/core';
import { BaseFormComponent } from "../base-form.component";
import { CircumstanceModel } from "../../../models/circumstance.model";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-circumstance-form',
  templateUrl: './circumstance-form.component.html',
  styleUrls: ['./circumstance-form.component.scss']
})
export class CircumstanceFormComponent extends BaseFormComponent<CircumstanceModel> {
  circumstance?: CircumstanceModel;
  constructor(private readonly formBuilder: FormBuilder) {
    super();
  }

  protected initForm() {
    this.form = this.formBuilder.group(
      {
        parked_stopped: false,
        leaving_parking_opening_door: false,
        entering_parking: false,
        emerging_from_car_park: false,
        entering_car_park: false,
        entering_roundabout: false,
        circulating_roundabout: false,
        rear_same_direction: false,
        same_direction_different_lane: false,
        changing_lanes: false,
        overtaking: false,
        turning_right: false,
        turning_left: false,
        reversing: false,
        driving_on_opposite_lane: false,
        from_right_crossing: false,
        disregarding_right_of_way_red_light: false,
      }, {emitEvent: false}
    );
  }

  setDefaults(value: CircumstanceModel) {
    this.circumstance = value;
    this.form.patchValue({
      parked_stopped: value.parked_stopped,
      leaving_parking_opening_door: value.leaving_parking_opening_door,
      entering_parking: value.entering_parking,
      emerging_from_car_park: value.emerging_from_car_park,
      entering_car_park: value.entering_car_park,
      entering_roundabout: value.entering_roundabout,
      circulating_roundabout: value.circulating_roundabout,
      rear_same_direction: value.rear_same_direction,
      same_direction_different_lane: value.same_direction_different_lane,
      changing_lanes: value.changing_lanes,
      overtaking: value.overtaking,
      turning_right: value.turning_right,
      turning_left: value.turning_left,
      reversing: value.reversing,
      driving_on_opposite_lane: value.driving_on_opposite_lane,
      from_right_crossing: value.from_right_crossing,
      disregarding_right_of_way_red_light: value.disregarding_right_of_way_red_light,
    }, {emitEvent: false});
  }

  protected override afterFormSubmit() {
    const crash = new CircumstanceModel({
      ...this.circumstance,
      ...this.form.value
    });
    this.emitValue(crash);
  }
}
