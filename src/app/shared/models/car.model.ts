import { BaseModel, ModelState } from "./base.model";
import { PolicyHolderModel } from "./policy-holder.model";
import { DriverModel } from "./driver.model";
import { InsuranceModel } from "./insurance.model";
import { CircumstanceModel } from "@app/shared/models/circumstance.model";

export class CarModel extends BaseModel {
  crash!: number;

  registration_plate?: string;
  registration_country?: string;
  car_type?: string;
  make_type?: string;
  creator?: string;

  policy_holder?: PolicyHolderModel;
  driver?: DriverModel;
  insurance?: InsuranceModel;
  circumstances?: CircumstanceModel;
  damaged_parts?: string[];
  initial_impact?: string[];
  responsibility_type?: string;

  rotation?: number;
  lat_lng_bounds_literal?: string;

  getCarModelState() {
    const childStates = [this.policy_holder?.state, this.driver?.state, this.insurance?.state];
    const isAnyPartial = childStates.some(state => state === ModelState.partial);
    const isAllValidated = childStates.every(state => state === ModelState.validated);
    const isAnyValidated = childStates.some(state => state === ModelState.validated);

    return isAnyPartial || (isAnyValidated && !isAllValidated) ? ModelState.partial : isAllValidated ? ModelState.validated : ModelState.empty;
  }

  getCarCircumstanceState() {
    const isDamagedPartsCompleted = this.damaged_parts && this.damaged_parts.length > 0;
    const isInitialImpactValidated = this.initial_impact && this.initial_impact.length > 0;
    const isCircumstanceValidated = this.circumstances && this.circumstances.state;

    return isDamagedPartsCompleted && isInitialImpactValidated && isCircumstanceValidated
      ? ModelState.validated
      : (isDamagedPartsCompleted && !isInitialImpactValidated) || (isInitialImpactValidated && !isDamagedPartsCompleted)
        ? ModelState.partial
        : isCircumstanceValidated ? ModelState.partial: ModelState.empty;
  }
}
