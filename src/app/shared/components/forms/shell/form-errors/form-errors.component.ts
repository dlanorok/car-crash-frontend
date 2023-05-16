import { Component, Input } from '@angular/core';
import { AbstractControl } from "@angular/forms";
import { ValidatorsErrors } from "../../common/enumerators/validators-errors";

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss']
})
export class FormErrorsComponent {
  @Input() control!: AbstractControl;

  readonly validatorErrors: typeof ValidatorsErrors = ValidatorsErrors;

}
