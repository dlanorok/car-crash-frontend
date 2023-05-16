import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { createCrash } from "../../../app-state/crash/crash-action";
import { BaseFormModalComponent } from "../../../shared/components/modals/base-form-modal/base-form-modal.component";
import { CarFormComponent } from "../../../shared/components/forms/car-form/car-form.component";
import { CarFormModule } from "../../../shared/components/forms/car-form/car-form.module";
import { CarModel } from "../../../shared/models/car.model";
import { of, take, tap } from "rxjs";
import { CrashModel } from "../../../shared/models/crash.model";
import { ModalService } from "../../../shared/services/modal.service";
import { CrashFormComponent } from "../../../shared/components/forms/crash-form/crash-form.component";
import { CrashFormModule } from "../../../shared/components/forms/crash-form/crash-form.module";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  localStorageCrash?: string | null;

  constructor(
    private readonly modalService: ModalService,
    private readonly store: Store,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  createCrash() {
    this.modalService.open(BaseFormModalComponent, {
      formComponent: {
        component: CrashFormComponent,
        module: CrashFormModule,
      },
      model: new CrashModel(),
      title: 'Create crash',
      afterSubmit$: (crash: CrashModel) => {
        return of(this.store.dispatch(createCrash({crash})))
      }
    });
  }

  ngOnInit(): void {
    this.localStorageCrash = localStorage.getItem('session_id')
  }
}
