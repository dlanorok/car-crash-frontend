import { Component, inject, OnInit } from '@angular/core';
import { DriverFormComponent } from "@app/shared/components/forms/driver-form/driver-form.component";
import { DriverModel } from "@app/shared/models/driver.model";
import { CarModel } from "@app/shared/models/car.model";
import { HeaderService } from "@app/shared/services/header-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { updateCarSubModel } from "@app/app-state/car/car-action";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { BaseFlowCarSubModelComponent } from "@app/home/pages/accident-report-flow/base-flow-car-sub-model.component";

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent extends BaseFlowCarSubModelComponent<DriverFormComponent, DriverModel> implements OnInit {
  protected readonly headerService: HeaderService = inject(HeaderService);

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Driver', preventBack: true});
    super.ngOnInit();
  }

  setFormData(car: CarModel) {
    this.model = car.driver || new DriverModel({car: car.id});
    this.formComponent?.setDefaults(this.model);
    if (car.creator !== this.cookieService.get(CookieName.sessionId)) {
      this.formComponent?.form.disable({ emitEvent: false });
    }
  }

  protected saveForm(driver: DriverModel, validate = false) {
    this.model = Object.assign(new DriverModel({car: this.model.car}), driver);
    this.model.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: this.model.car,
        model: this.model
      }));

    if (validate) {
      this.nextPage();
    }
  }

  protected nextPage() {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/${this.model.car}/circumstances`]);
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/${this.model.car}/insurance-company`]);
  }
}
