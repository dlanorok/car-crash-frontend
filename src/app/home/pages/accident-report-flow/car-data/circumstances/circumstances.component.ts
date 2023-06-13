import { Component, inject, OnInit } from '@angular/core';
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { HeaderService } from "@app/shared/services/header-service";
import { BaseFlowComponent } from "@app/home/pages/accident-report-flow/base-flow.component";
import { Observable } from "rxjs";
import { CircumstanceFormComponent } from "@app/shared/components/forms/circumstance-form/circumstance-form.component";
import { CircumstanceModel } from "@app/shared/models/circumstance.model";
import { CarModel } from "@app/shared/models/car.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { updateCarSubModel } from "@app/app-state/car/car-action";

@Component({
  selector: 'app-circumstances',
  templateUrl: './circumstances.component.html',
  styleUrls: ['./circumstances.component.scss']
})
export class CircumstancesComponent extends BaseFlowComponent<CircumstanceFormComponent, CircumstanceModel> implements OnInit {
  protected readonly headerService: HeaderService = inject(HeaderService);
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  ngOnInit() {
    this.headerService.setHeaderData({name: '§§Driver', preventBack: true});
    super.ngOnInit();
  }

  setFormsData() {
    this.baseModel = this.car?.circumstances || new CircumstanceModel({car: this.car?.id});
    this.formComponent?.setDefaults(this.baseModel);
  }

  protected saveForm(circumstance: CircumstanceModel, validate = false) {
    circumstance = Object.assign(new CircumstanceModel({car: this.baseModel.car}), circumstance);
    circumstance.validate = validate;
    this.store.dispatch(
      updateCarSubModel({
        carId: circumstance.car,
        model: circumstance
      }));

    if (validate) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}/cars/my-car/damaged-parts`]);
    }
  }

  previous(): void {
    const sessionId = localStorage.getItem(StorageItem.sessionId);
    this.router.navigate([`/crash/${sessionId}/cars/my-car/driver`]);
  }
}
