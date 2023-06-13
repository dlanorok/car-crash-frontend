import { Component, inject, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";
import { HeaderService } from "@app/shared/services/header-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { PolicyHolderFormComponent } from "@app/shared/components/forms/policy-holder-form/policy-holder-form.component";
import { PolicyHolderModel } from "@app/shared/models/policy-holder.model";
import { updateCarSubModel } from "@app/app-state/car/car-action";
import { selectCars } from "@app/app-state/car/car-selector";
import { CarModel } from "@app/shared/models/car.model";

@Component({
  selector: 'app-policy-holder',
  templateUrl: './policy-holder.component.html',
  styleUrls: ['./policy-holder.component.scss']
})
export class PolicyHolderComponent extends BaseFlowComponent<PolicyHolderFormComponent, PolicyHolderModel> implements OnInit {
  protected readonly headerService: HeaderService = inject(HeaderService);

  cars$: Observable<CarModel[]> = this.store.select(selectCars);


  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Policy holder', preventBack: true});
    super.ngOnInit();
  }

  setFormsData() {
    this.baseModel = this.car?.policy_holder || new PolicyHolderModel({car: this.car?.id});
    this.formComponent?.setDefaults(this.baseModel);
  }

  protected saveForm(policyHolder: PolicyHolderModel, validate = false) {
    policyHolder = Object.assign(new PolicyHolderModel({car: this.baseModel.car}), policyHolder);
    policyHolder.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: policyHolder.car,
        model: policyHolder
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/insurance-company`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}`]);
  }
}
