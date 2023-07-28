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
  inputs: Input[];
}

export interface Section {
  id: string;
  name: string;
  helpText?: string;
  state: ModelState,
  starting_step: StepType
}

export interface Step {
  step_type: StepType
  question: string;
  input: number
  next_step?: StepType;
}

export interface Option {
  label: string;
  value: any;
  action: string;
  action_property: any;
  next_step: StepType;
}

export enum InputType {
  select = 'select',
  input = 'input',
  boolean = 'boolean',
  text = 'text',
  multiChoiceQuestion = 'multiChoiceQuestion',
  dateTime = 'datetime',
  date = 'date',
}

export enum StepType {
  injuries = 'injuries'
}

export interface Input {
  id: number;
  type: InputType;
  value: any;
  options?: Option[];
  required?: boolean;
  placeholder?: string;
}
