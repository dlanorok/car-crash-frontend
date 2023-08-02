import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from "@app/shared/services/header-service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { PolicyHolderFormComponent } from "@app/shared/components/forms/policy-holder-form/policy-holder-form.component";
import { PolicyHolderModel } from "@app/shared/models/policy-holder.model";
import { updateCarSubModel } from "@app/app-state/car/car-action";
import { CarModel } from "@app/shared/models/car.model";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { BaseFlowCarSubModelComponent } from "@app/home/pages/accident-report-flow/base-flow-car-sub-model.component";

@Component({
  selector: 'app-policy-holder',
  templateUrl: './policy-holder.component.html',
  styleUrls: ['./policy-holder.component.scss']
})
export class PolicyHolderComponent extends BaseFlowCarSubModelComponent<PolicyHolderFormComponent, PolicyHolderModel> implements OnInit {
  protected readonly headerService: HeaderService = inject(HeaderService);

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Policy holder'});
    super.ngOnInit();
  }

  setFormData(car: CarModel) {
    this.model = car.policy_holder || new PolicyHolderModel({car: car.id});
    this.formComponent?.setDefaults(this.model);
    if (car.creator !== this.cookieService.get(CookieName.sessionId)) {
      this.formComponent?.form.disable({ emitEvent: false });
    }
  }

  protected saveForm(policyHolder: PolicyHolderModel, validate = false) {
    this.model = Object.assign(new PolicyHolderModel({car: this.model.car}), policyHolder);
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
    this.router.navigate([`/crash/${sessionId}/cars/${this.model.car}/insurance-company`]);
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}`]);
  }
}
