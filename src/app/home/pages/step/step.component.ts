import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { mergeMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { CrashesApiService } from "@app/shared/api/crashes/crashes-api.service";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Action, Input, InputType, Option, Section, Step, StepType } from "@app/home/pages/crash/flow.definition";
import { Location } from '@angular/common';
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";
import { HeaderService } from "@app/shared/services/header-service";

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent extends BaseFooterComponent implements OnInit {
  protected readonly router: Router = inject(Router);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly store: Store = inject(Store);
  protected readonly crashesApiService: CrashesApiService = inject(CrashesApiService);
  protected readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  protected readonly location: Location = inject(Location);
  protected readonly headerService: HeaderService = inject(HeaderService);

  stepType!: StepType;
  questionnaireId!: number;
  sessionId!: string;
  questionnaire?: QuestionnaireModel;

  section?: Section;
  step?: Step;

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.route.paramMap
      .pipe(
        mergeMap((params) => {
          const sectionId =  params.get('sectionId');
          const stepType =  params.get('stepType');
          const questionnaireId =  params.get('questionnaireId');
          const sessionId =  params.get('sessionId');

          if (questionnaireId) {
            this.questionnaireId = parseInt(questionnaireId);
          }
          if (sessionId) {
            this.sessionId = sessionId;
          }

          return this.questionnaireService.getOrFetchQuestionnaires()
            .pipe(
              tap((questionnaires) => {
                this.questionnaire = questionnaires.find(questionnaire => questionnaire.id === this.questionnaireId);
                if (sectionId) {
                  this.section = this.questionnaire?.data.sections.find(section => section.id === sectionId);
                  this.headerService.setHeaderData({name: this.section?.name || ''});
                }
                if (stepType) {
                  this.step = this.questionnaire?.data.steps.find((step) => step.step_type === stepType);
                }
              })
            );
        }),
      )
      .subscribe();
  }

  onSelectInput(input: Input): void {
    const selectedOption: Option | undefined = input.options?.find(option => option.value === input.value);
    this.updateAnswer(input);

    switch (selectedOption?.action) {
      case Action.call:
        window.location.href = `tel:${selectedOption.action_property.number}`;
        break;
      case Action.nextStep:
        if (selectedOption?.action_property?.step) {
          this.router.navigate(
            [`/crash/${this.sessionId}/questionnaires/${this.questionnaireId}/sections/${this.section?.id}/steps/${selectedOption?.action_property.step}`]
          );
        } else {
          this.next();
        }
        break;
    }
  }

  updateAnswer(input: Input): void {
    this.questionnaireService.saveInput(this.questionnaireId, input);
  }

  previous(): void {
    this.location.back();
  }

  next(): void {

    if (this.questionnaire) {
      this.questionnaireService.saveQuestionnaire(this.questionnaire);
    }

    if (!this.step) {
      this.router.navigate([`/crash/${this.sessionId}`]);
      return;
    }

    // For now select first input of steps
    const input = this.questionnaire?.data.inputs.find(input => input.id === this.step?.input);

    if (input?.type === InputType.select) {
      const selectedOption: Option | undefined = input.options?.find(option => option.value === input.value);
      if (selectedOption?.action === Action.nextStep && selectedOption?.action_property?.step) {
        this.router.navigate([`/crash/${this.sessionId}/questionnaires/${this.questionnaireId}/sections/${this.section?.id}/steps/${selectedOption?.action_property.step}`]);
        return;
      }
    }

    if (this.step?.next_step) {
      this.router.navigate([`/crash/${this.sessionId}/questionnaires/${this.questionnaireId}/sections/${this.section?.id}/steps/${this.step?.next_step}`]);
      return;
    }

    this.router.navigate([`/crash/${this.sessionId}`]);
  }

  valueUpdated(input: Input, newValue: any) {
    input.value = newValue;
    this.updateAnswer(input);
  }
}
