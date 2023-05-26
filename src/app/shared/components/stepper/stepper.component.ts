import { Component, Input } from '@angular/core';
import { Step } from "../../common/stepper-data";

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {

  @Input() steps!: Step[];
  @Input() currentStep!: number;

}
