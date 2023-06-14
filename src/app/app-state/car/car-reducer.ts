import { createReducer, on } from '@ngrx/store';
import { CarModel } from "../../shared/models/car.model";
import {
  createCar,
  createCarSuccessful,
  deleteCarSuccessful,
  loadCarsSuccessful,
  updateCarDamagedParts,
  updateCarInitialImpact,
  updateCarSubModel, updateCarSubModelSuccessful,
  updateCarSuccessful, wsCarUpdated
} from "./car-action";
import { PolicyHolderModel } from "../../shared/models/policy-holder.model";
import { DriverModel } from "../../shared/models/driver.model";
import { InsuranceModel } from "../../shared/models/insurance.model";
import { CircumstanceModel } from "@app/shared/models/circumstance.model";

export interface CarState {
  cars: CarModel[],
}

export const initialState: CarState = {
  cars: [],
};

export const carReducer = createReducer(
  initialState,
  on(createCar, (state) => {
    return {
      ...state
    };
  }),
  on(createCarSuccessful, (state, {car}) => {
    return {
      ...state,
      cars: [...state.cars, car]
    };
  }),
  on(deleteCarSuccessful, (state, {carId}) => {
    return {
      ...state,
      cars: [...state.cars.filter(car => car.id !== carId)]
    };
  }),
  on(loadCarsSuccessful, (state, {cars}) => {
    return {
      ...state,
      cars: [...cars]
    };
  }),
  on(updateCarSuccessful, (state, {car}) => {
    return {
      ...state,
      cars: [...state.cars.map(_car => {
        if (car.id === _car.id) {
          return car;
        }
        return _car;
      })]
    };
  }),
  on(wsCarUpdated, (state, {car}) => {
    return {
      ...state,
      cars: [...state.cars.filter(_car => _car.id !== car.id), car]
    };
  }),
  on(updateCarSubModelSuccessful, (state, {carId, model}) => {
    return {
      ...state,
      cars: [...state.cars.map(_car => {
        if (_car.id === carId) {
          const car = new CarModel();
          Object.assign(car, _car);
          if (model instanceof PolicyHolderModel) {
            car.policy_holder = model;
          } else if (model instanceof DriverModel) {
            car.driver = model;
          } else if (model instanceof InsuranceModel) {
            car.insurance = model;
          } else if (model instanceof CircumstanceModel) {
            car.circumstances = model;
          }
          return car;
        }
        return _car;
      })]
    };
  }),
  on(updateCarSubModel, (state, {carId, model}) => {
    return {
      ...state,
      cars: [...state.cars.map(_car => {
        if (_car.id === carId) {
          const car = new CarModel();
          Object.assign(car, _car);
          if (model instanceof PolicyHolderModel) {
            car.policy_holder = model;
          } else if (model instanceof DriverModel) {
            car.driver = model;
          } else if (model instanceof InsuranceModel) {
            car.insurance = model;
          } else if (model instanceof CircumstanceModel) {
            car.circumstances = model;
          }
          return car;
        }
        return _car;
      })]
    };
  }),
  on(updateCarDamagedParts, (state, {carId, damagedParts}) => {
    return {
      ...state,
      cars: [...state.cars.map(_car => {
        if (_car.id === carId) {
          const car = new CarModel();
          Object.assign(car, _car);
          car.damaged_parts = damagedParts;
          return car;
        }
        return _car;
      })]
    };
  }),
  on(updateCarInitialImpact, (state, {carId, initialImpacts}) => {
    return {
      ...state,
      cars: [...state.cars.map(_car => {
        if (_car.id === carId) {
          const car = new CarModel();
          Object.assign(car, _car);
          car.initial_impact = initialImpacts;
          return car;
        }
        return _car;
      })]
    };
  }),
);
