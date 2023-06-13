import { Component, inject, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { HeaderService } from "@app/shared/services/header-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { updateCarSubModel } from "@app/app-state/car/car-action";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";
import { InsuranceFormComponent } from "@app/shared/components/forms/insurance-form/insurance-form.component";
import { InsuranceModel } from "@app/shared/models/insurance.model";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent extends BaseFlowComponent<InsuranceFormComponent, InsuranceModel> implements OnInit {
  protected readonly headerService: HeaderService = inject(HeaderService);

  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Insurance company', preventBack: true});
    super.ngOnInit();
  }

  setFormsData() {
    this.baseModel = this.car?.insurance || new InsuranceModel({car: this.car?.id});
    this.formComponent?.setDefaults(this.baseModel);
  }

  protected saveForm(insurance: InsuranceModel, validate = false) {
    insurance = Object.assign(new InsuranceModel({car: this.baseModel.car}), insurance);
    insurance.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: insurance.car,
        model: insurance
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/driver`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/policy-holder`]);
  }
}
