import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { distinctUntilChanged, mergeMap, Subject, takeUntil, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Action, Input, InputType, Option, Section, Step, StepType } from "@app/home/pages/crash/flow.definition";
import { Location } from '@angular/common';
import { BaseFooterComponent } from "@app/home/pages/accident-report-flow/base-footer.component";
import { HeaderService } from "@app/shared/services/header-service";
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { GetStepInputsPipe } from "@app/home/pages/step/pipes/get-step-inputs.pipe";
import { updateEntireFormValidity } from "@app/shared/forms/helpers/update-entire-form-validity";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastrService } from "ngx-toastr";

@UntilDestroy()
@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent extends BaseFooterComponent implements OnInit, OnDestroy {
  protected readonly router: Router = inject(Router);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly store: Store = inject(Store);
  protected readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  protected readonly location: Location = inject(Location);
  protected readonly headerService: HeaderService = inject(HeaderService);
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly getStepInputsPipe: GetStepInputsPipe = inject(GetStepInputsPipe);
  protected readonly cookieService: CookieService = inject(CookieService);
  protected readonly toastr: ToastrService = inject(ToastrService);

  protected destroy$: Subject<void> = new Subject<void>();

  stepType!: StepType;
  questionnaireId!: number;
  sessionId!: string;
  questionnaire?: QuestionnaireModel;
  submitted = false;

  section?: Section;
  step?: Step;
  form!: UntypedFormGroup;

  ngOnInit(): void {
    this.getData();
    this.subscribeToQuestionnaire();
  }

  private subscribeToQuestionnaire() {
    this.questionnaireService.questionnairesUpdates$.pipe(
      untilDestroyed(this)
    ).subscribe((questionnaires) => {
      const newQuestionnaire = questionnaires.find(questionnaire => this.questionnaire?.id === questionnaire.id);

      if (newQuestionnaire) {
        this.questionnaire = newQuestionnaire;
        this.defineInputs(this.stepType);
      }
    });
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
          if (stepType) {
            this.stepType = stepType as StepType;
          }

          return this.questionnaireService.getOrFetchQuestionnaires()
            .pipe(
              tap((questionnaires) => {
                this.questionnaire = questionnaires.find(questionnaire => questionnaire.id === this.questionnaireId);
                if (sectionId) {
                  this.section = this.questionnaire?.data.sections.find(section => section.id === sectionId);
                  this.headerService.setHeaderData({name: this.section?.name || ''});
                }
                this.defineInputs(stepType);
              })
            );
        }),
      )
      .subscribe();
  }

  private defineInputs(stepType: string | null): void {
    if (stepType) {
      this.step = this.questionnaire?.data.steps.find((step) => step.step_type === stepType);

      if (this.step && this.questionnaire) {
        const inputs = this.getStepInputsPipe.transform(this.step, this.questionnaire);

        this.form = this.formBuilder.group({});
        inputs.forEach(input => {
          const control = this.formBuilder.control({
            value: input.value,
            disabled: this.questionnaire?.creator !== this.cookieService.get(CookieName.sessionId)
          });

          if (input.required) {
            control.addValidators(Validators.required);
          }
          if (input.input_type === 'email') {
            control.addValidators(Validators.email);
          }

          this.listenToChanges(input, control);

          this.form?.addControl(input.id.toString(), control);
        });
      }
    }
  }

  private listenToChanges(input: Input, control: AbstractControl) {
    if (input.type === InputType.select) {
      control.valueChanges.pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe((value) => {
        const selectedOption: Option | undefined = input.options?.find(option => option.value === value);
        switch (selectedOption?.action) {
          case Action.call:
            window.location.href = `tel:${selectedOption.action_property.number}`;
            break;
          case Action.nextStep:
            if (selectedOption?.action_property?.step) {
              this.next(`/crash/${this.sessionId}/questionnaires/${this.questionnaireId}/sections/${this.section?.id}/steps/${selectedOption?.action_property.step}`);
            } else {
              this.next();
            }
            break;
        }
      });
    }
  }

  updateAnswer(): void {
    if (this.questionnaire) {
      this.questionnaireService.updateInputs(this.form.value, this.questionnaire);
    }
  }

  previous(): void {
    this.location.back();
  }

  next(url?: string): void {
    this.submitted = true;
    updateEntireFormValidity(this.form);

    if (!this.form?.valid && !this.form.disabled) {
      this.toastr.error('§§ This field is required');
      return;
    }
    this.toastr.clear();

    this.submitted = false;
    if (this.questionnaire && this.step && !this.form.disabled) {
      this.questionnaireService.updateInputs(this.form.value, this.questionnaire);
    }

    if (!this.step) {
      this.router.navigate([`/crash/${this.sessionId}`]);
      return;
    }

    // For now select first input of steps
    const input = this.questionnaire?.data.inputs.find(input => input.id === this.step?.inputs[0]);

    if (url) {
      this.router.navigate([url]);
      return;
    }

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
    this.form.get(input.id.toString())?.setValue(newValue);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
