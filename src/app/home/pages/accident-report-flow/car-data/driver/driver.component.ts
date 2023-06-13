import { Component, inject, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { DriverFormComponent } from "@app/shared/components/forms/driver-form/driver-form.component";
import { DriverModel } from "@app/shared/models/driver.model";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { HeaderService } from "@app/shared/services/header-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { updateCarSubModel } from "@app/app-state/car/car-action";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent extends BaseFlowComponent<DriverFormComponent, DriverModel> implements OnInit {
  protected readonly headerService: HeaderService = inject(HeaderService);

  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Driver', preventBack: true});
    super.ngOnInit();
  }

  setFormsData() {
    this.baseModel = this.car?.driver || new DriverModel({car: this.car?.id});
    this.formComponent?.setDefaults(this.baseModel);
  }

  protected saveForm(driver: DriverModel, validate = false) {
    driver = Object.assign(new DriverModel({car: this.baseModel.car}), driver);
    driver.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: driver.car,
        model: driver
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/circumstances`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/insurance-company`]);
  }
}
