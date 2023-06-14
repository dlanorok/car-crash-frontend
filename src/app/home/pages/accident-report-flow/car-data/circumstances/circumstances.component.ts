import { Component, inject, OnInit } from '@angular/core';
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { HeaderService } from "@app/shared/services/header-service";
import { CircumstanceFormComponent } from "@app/shared/components/forms/circumstance-form/circumstance-form.component";
import { CircumstanceModel } from "@app/shared/models/circumstance.model";
import { CarModel } from "@app/shared/models/car.model";
import { updateCarSubModel } from "@app/app-state/car/car-action";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { BaseFlowCarSubModelComponent } from "@app/home/pages/accident-report-flow/base-flow-car-sub-model.component";

@Component({
  selector: 'app-circumstances',
  templateUrl: './circumstances.component.html',
  styleUrls: ['./circumstances.component.scss']
})
export class CircumstancesComponent extends BaseFlowCarSubModelComponent<CircumstanceFormComponent, CircumstanceModel> implements OnInit {
  protected readonly headerService: HeaderService = inject(HeaderService);

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Driver', preventBack: true});
    super.ngOnInit();
  }

  setFormData(car: CarModel) {
    this.model = car.circumstances || new CircumstanceModel({car: car.id});
    this.formComponent?.setDefaults(this.model);
    if (car.creator !== this.cookieService.get(CookieName.sessionId)) {
      this.formComponent?.form.disable({ emitEvent: false });
    }
  }

  protected saveForm(circumstance: CircumstanceModel, validate = false) {
    this.model = Object.assign(new CircumstanceModel({car: this.model.car}), circumstance);
    this.model.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: this.model.car,
        model: this.model
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/${this.model.car}/damaged-parts`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/${this.model.car}/driver`]);
  }
}
