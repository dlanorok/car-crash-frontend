import { ModelState } from "@app/shared/models/base.model";

export enum SupportedModels {
  CRASH = 'crash'
}

export enum Action {
  call = "call",
  nextStep = 'next_step'
}

export interface QuestionnaireData {
  sections: Section[];
  steps: Step[];
  inputs:  Record<string, Input>;
}

export interface Section {
  id: string;
  name: string;
  helpText?: string;
  state: ModelState,
  starting_step: StepType
}

export interface Step {
  step_type: StepType;
  question: string;
  help_text: string;
  additional_help: string;
  inputs: number[];
  next_step?: StepType;
  data_from_input?: number;
  updated_inputs?: string[];
  main_screen?: boolean;
  chapter?: boolean;
}

export interface Option {
  label: string;
  value: any;
  action?: string;
  action_property?: any;
  next_step?: StepType;
  icon?: string;
}

export enum ArrowType {
  null = "null",
  straight = "straight",
  reverse = "reverse",
  right = "right",
  left = "left",
  straightRight = "straight_right",
  straightLeft = "straight_left",
}

export enum SectionId {
  startingQuestions = 'starting_questions',
  circumstances = 'circumstances',
  vehicleDamage = 'vehicle_damage',
  accidentSketch = 'accident_sketch',
  carAndInsurance = 'car_and_insurance',
  driver = 'driver',
  additional = 'additional',
  confirmation = 'confirmation'
}

export enum InputType {
  select = 'select',
  input = 'input',
  boolean = 'boolean',
  text = 'text',
  multiChoiceQuestion = 'multiChoiceQuestion',
  dateTime = 'datetime',
  date = 'date',
  number = 'number',
  textarea = 'textarea',
  collision_direction = 'collision_direction',
  damaged_parts = 'damaged_parts',
  place = 'place',
  phone_picker = 'phone_picker',
  country_picker = 'country_picker',
  insurance_picker = 'insurance_picker',
  driving_license = 'driving_license',
  sketch = 'sketch',
  imageUpload = 'image_upload',
  invite = 'invite',
  confirmation = 'confirmation',
  final_step = 'final_step',
}

export enum StepType {
  injuries = 'injuries',
  registration_number = 'registration_number',
  accident_sketch = 'accident_sketch'
}

export interface Input {
  id: number;
  type: InputType;
  value: any;
  options?: Option[];
  required?: boolean;
  placeholder?: string;
  input_type?: string;
  on_change_action?: string;
  label?: string;
}
