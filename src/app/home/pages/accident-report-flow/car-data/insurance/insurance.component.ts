import { Component, inject, OnInit } from '@angular/core';
import { CarModel } from "@app/shared/models/car.model";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { updateCarSubModel } from "@app/app-state/car/car-action";
import { InsuranceFormComponent } from "@app/shared/components/forms/insurance-form/insurance-form.component";
import { InsuranceModel } from "@app/shared/models/insurance.model";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { BaseFlowCarSubModelComponent } from "@app/home/pages/accident-report-flow/base-flow-car-sub-model.component";
import { PageDataService } from "@app/shared/services/page-data.service";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent extends BaseFlowCarSubModelComponent<InsuranceFormComponent, InsuranceModel> implements OnInit {
  protected readonly pageDataService: PageDataService = inject(PageDataService);

  ngOnInit() {
    this.pageDataService.pageData = {pageName: '§§Insurance company'};
    super.ngOnInit();
  }

  setFormData(car: CarModel) {
    this.model = car.insurance || new InsuranceModel({car: car.id});
    if (car.creator !== this.cookieService.get(CookieName.sessionId)) {
      this.formComponent?.form.disable({ emitEvent: false });
    }
    this.formComponent?.setDefaults(this.model);
  }

  protected saveForm(insurance: InsuranceModel, validate = false) {
    this.model = Object.assign(new InsuranceModel({car: this.model.car}), insurance);
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
    this.router.navigate([`/crash/${sessionId}/cars/${this.model.car}/driver`]);
  }
}
