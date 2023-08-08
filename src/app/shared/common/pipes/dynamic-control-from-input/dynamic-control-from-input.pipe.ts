import { inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { Input, InputType } from "@app/home/pages/crash/flow.definition";
import { DynamicControlComponentConfiguration } from "@app/shared/form-controls/dynamic-control-component-configuration";
import { NumberControlComponent } from "@app/shared/form-controls/number-control/number-control.component";
import { NumberControlModule } from "@app/shared/form-controls/number-control/number-control.module";
import { DateControlComponent } from "@app/shared/form-controls/date-control/date-control.component";
import { DateTimeControlModule } from "@app/shared/form-controls/date-time-control/date-time-control.module";
import { DateTimeControlComponent } from "@app/shared/form-controls/date-time-control/date-time-control.component";
import { StackedSelectControlComponent } from "@app/shared/form-controls/stacked-select-control/stacked-select-control.component";
import { StackedSelectControlModule } from "@app/shared/form-controls/stacked-select-control/stacked-select-control.module";
import { PointOfInitialImpactComponent } from "@app/shared/components/control-value-accessors/svg-selector/point-of-initial-impact/point-of-initial-impact.component";
import { PointOfInitialImpactModule } from "@app/shared/components/control-value-accessors/svg-selector/point-of-initial-impact/point-of-initial-impact.module";
import { VisibleDamageSelectorComponent } from "@app/shared/components/control-value-accessors/svg-selector/visible-damage-selector/visible-damage-selector.component";
import { VisibleDamageSelectorModule } from "@app/shared/components/control-value-accessors/svg-selector/visible-damage-selector/visible-damage-selector.module";
import { PlaceSelectorComponent } from "@app/shared/components/control-value-accessors/place-selector/place-selector.component";
import { PlaceSelectorModule } from "@app/shared/components/control-value-accessors/place-selector/place-selector.module";
import { CountryControlComponent } from "@app/shared/form-controls/select-control/implementations/country-control/country-control.component";
import { CountryControlModule } from "@app/shared/form-controls/select-control/implementations/country-control/country-control.module";
import { DriverControlComponent } from "@app/shared/components/control-value-accessors/driver/driver-control/driver-control.component";
import { DriverControlModule } from "@app/shared/components/control-value-accessors/driver/driver-control/driver-control.module";
import { PhoneNumberControlComponent } from "@app/shared/form-controls/phone-number-control/phone-number-control.component";
import { PhoneNumberControlModule } from "@app/shared/form-controls/phone-number-control/phone-number-control.module";
import { TextControlComponent } from "@app/shared/form-controls/text-control/text-control.component";
import { TextControlModule } from "@app/shared/form-controls/text-control/text-control.module";

@Pipe({
  name: 'dynamicControlFromInput',
})
export class DynamicControlFromInputPipe implements PipeTransform {
  private injector: Injector = inject(Injector);


  transform(input: Input, submitted: boolean): DynamicControlComponentConfiguration<any> | null {
    let component, module;
    let additionalOptions = {};
    switch (input.type) {
      case InputType.text:
        component = TextControlComponent;
        module = TextControlModule;
        additionalOptions = { type: input.input_type };
        break;
      case InputType.number:
        component = NumberControlComponent;
        module = NumberControlModule;
        break;
        // TODO
      // case InputType.textarea:
      //   component = TextAr;
      //   module = TextControlModule;
      //   break;
      case InputType.date:
        component = DateControlComponent;
        module = DateTimeControlModule;
        break;
      case InputType.dateTime:
        component = DateTimeControlComponent;
        module = DateTimeControlModule;
        break;
      case InputType.select:
      case InputType.insurance_picker:
        component = StackedSelectControlComponent;
        module = StackedSelectControlModule;
        additionalOptions = {options: input.options};
        break;
      case InputType.collision_direction:
        component = PointOfInitialImpactComponent;
        module = PointOfInitialImpactModule;
        break;
      case InputType.damaged_parts:
        component = VisibleDamageSelectorComponent;
        module = VisibleDamageSelectorModule;
        break;
      case InputType.place:
        component = PlaceSelectorComponent;
        module = PlaceSelectorModule;
        break;
      case InputType.phone_picker:
        component = PhoneNumberControlComponent;
        module = PhoneNumberControlModule;
        break;
      case InputType.country_picker:
        component = CountryControlComponent;
        module = CountryControlModule;
        break;
      case InputType.driving_license:
        component = DriverControlComponent;
        module = DriverControlModule;
        break;
    }

    if (!component || !module) {
      return null;
    }

    return {
      component: component,
      module: module,
      injector: this.injector,
      componentStaticInputs: {
        label: input.label || '',
        placeholder: input.placeholder || '',
        submitted: submitted,
        ...additionalOptions
      }
    };
  }
}
