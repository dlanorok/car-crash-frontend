import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { createCrash } from "../../../app-state/crash/crash-action";

@Component({
  selector: 'app-create-crash',
  templateUrl: './create-crash.component.html',
  styleUrls: ['./create-crash.component.scss']
})
export class CreateCrashComponent {

  constructor(
    private readonly store: Store
  ) {}

  createCrash() {
    this.store.dispatch(createCrash());
  }
}
