import { Component, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {
  distinctUntilChanged,
  mergeMap,
  Observable,
  of, publishReplay, refCount,
  skip, startWith,
  Subject, switchMap,
  take,
  takeUntil,
  tap,
  zip
} from "rxjs";
import { Store } from "@ngrx/store";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Action, Input, InputType, Option, Section, SectionId, Step, StepType } from "@app/home/pages/crash/flow.definition";
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { GetStepInputsPipe } from "@app/home/pages/step/pipes/get-step-inputs.pipe";
import { updateEntireFormValidity } from "@app/shared/forms/helpers/update-entire-form-validity";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastrService } from "ngx-toastr";
import { DynamicControlDirective } from "@app/shared/common/directives/dynamic-control.directive";
import { PageDataService } from "@app/shared/services/page-data.service";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { loadCrash } from "@app/app-state/crash/crash-action";
import { TranslocoService } from "@ngneat/transloco";

@UntilDestroy()
@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit, OnDestroy {
  protected readonly router: Router = inject(Router);
  protected readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly store: Store = inject(Store);
  protected readonly questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  protected readonly location: Location = inject(Location);
  protected readonly pageDataService: PageDataService = inject(PageDataService);
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly getStepInputsPipe: GetStepInputsPipe = inject(GetStepInputsPipe);
  protected readonly cookieService: CookieService = inject(CookieService);
  protected readonly toastr: ToastrService = inject(ToastrService);
  protected readonly translateService: TranslocoService = inject(TranslocoService);

  crash$: Observable<CrashModel> = this.store.select(selectCrash);
  protected destroy$: Subject<void> = new Subject<void>();

  stepType!: StepType;
  questionnaireId!: number;
  sessionId!: string;
  questionnaire?: QuestionnaireModel;
  submitted = false;

  section?: Section;
  step?: Step;
  form!: UntypedFormGroup;
  inputs: Input[] = [];
  readonly SectionId: typeof SectionId = SectionId;

  readonly next$: Subject<boolean> = new Subject<boolean>();
  readonly back$: Subject<void> = new Subject<void>();
  @ViewChildren(DynamicControlDirective) private readonly dynamicControlDirectives?: QueryList<DynamicControlDirective<any>>;

  readonly questionnaires$: Observable<QuestionnaireModel[]> = this.questionnaireService.questionnaireUpdates$.pipe(
    startWith(undefined),
    switchMap(() => {
      return this.questionnaireService.getOrFetchQuestionnaires();
    }),
    publishReplay(1),
    refCount()
  );

  ngOnInit(): void {
    this.getData();
    this.subscribeToQuestionnaire();
    this.subscribeToNavigationSubjects();

    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCrash({sessionId: sessionId }));
  }

  private subscribeToQuestionnaire() {
    this.questionnaireService.questionnaireUpdates$.pipe(
      untilDestroyed(this)
    ).subscribe((questionnaire) => {
      if (questionnaire && questionnaire.id === this.questionnaire?.id && this.section?.id === SectionId.accidentSketch) {
        this.questionnaire = questionnaire;
        this.updateControls(true);
      }
    });
  }

  private subscribeToNavigationSubjects() {
    this.next$.pipe(untilDestroyed(this)).subscribe((skipSave) => {
      this.next(undefined, skipSave);
    });

    this.back$.pipe(untilDestroyed(this)).subscribe(() => {
      this.previous();
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

          return this.questionnaires$
            .pipe(
              take(1),
              tap((questionnaires) => {
                this.questionnaire = questionnaires.find(questionnaire => questionnaire.id === this.questionnaireId);
                if (sectionId) {
                  this.section = this.questionnaire?.data.sections.find(section => section.id === sectionId);
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
        this.inputs = this.getStepInputsPipe.transform(this.step, this.questionnaire);

        this.form = this.formBuilder.group({});
        this.inputs.forEach(input => {
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

  private updateControls(silent?: boolean) {
    if (this.step && this.questionnaire) {
      const inputs = this.getStepInputsPipe.transform(this.step, this.questionnaire);
      inputs.forEach(input => {
        if (input.value === this.form.controls[input.id].value) {
          return;
        }
        this.form.controls[input.id].setValue(input.value, { emitEvent: !silent });
      });
    }
  }

  private listenToChanges(input: Input, control: AbstractControl) {
    control.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (input.type === InputType.select) {
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
      }
      if (input.type === InputType.place) {
        this.next();
      }

      if (input.value !== control.value) {
        control.markAsTouched();
      }
    });

    if (input.type === InputType.sketch) {
      this.form.valueChanges.pipe(
        distinctUntilChanged(),
        skip(1),
        takeUntil(this.destroy$)
      ).subscribe((value) => {
        if (this.questionnaire && control.value.save && this.step) {
          control.value.save = false;
          this.questionnaireService.updateInputs(value, this.questionnaire, this.step);
        }
      });
    }
  }

  private checkFormTouched(): boolean {
    if (this.form?.touched) {
      return confirm('You have unsaved changes, do you want to continue?');
    }
    return true;
  }

  private home(): void {
    if (this.checkFormTouched()) {
      const sessionId = localStorage.getItem(StorageItem.sessionId);
      this.router.navigate([`/crash/${sessionId}`]);
    }
  }

  previous(): void {
    if ((this.dynamicControlDirectives?.length || 0) > 0) {
      const observables = this.dynamicControlDirectives?.map(dynamicControlDirective => {
        const componentRef = dynamicControlDirective?.controlComponentRef;
        if (componentRef && typeof componentRef.instance.beforeBack === 'function') {
          return componentRef.instance.beforeBack().pipe(take(1));
        } else {
          return of(true);
        }
      });
      if (observables && observables.length > 0) {
        zip(observables).pipe(
          take(1)
        ).subscribe((values: boolean[]) => {
          const canContinue = values.reduce((acc: boolean, curr: boolean) => {
            return acc && curr;
          }, true);

          if (canContinue) {
            if (this.checkFormTouched()) {
              this.location.back();
            }
          }
        });
      }
    } else {
      if (this.checkFormTouched()) {
        this.location.back();
      }
    }
  }

  next(url?: string, skipSave?: boolean): void {
    this.submitted = true;
    const observables = this.dynamicControlDirectives?.map(dynamicControlDirective => {
      const componentRef = dynamicControlDirective?.controlComponentRef;
      if (componentRef && typeof componentRef.instance.beforeSubmit === 'function') {
        return componentRef.instance.beforeSubmit().pipe(take(1));
      } else {
        return of(true);
      }
    });

    if (observables && observables.length > 0) {
      zip(observables).pipe(take(1)).subscribe((values) => {
        const canContinue = values.reduce((acc: boolean, curr: boolean) => {
          return acc && curr;
        }, true);
        if (canContinue) {
          this.afterNext(url, skipSave);
        }
      });
    } else {
      this.afterNext(url, skipSave);
    }
  }

  private afterNext(url?: string, skipSave?: boolean) {
    updateEntireFormValidity(this.form);

    if (!this.form?.valid && !this.form.disabled) {
      this.toastr.error(this.translateService.translate('shared.forms/validators.labels.control_required.val'));
      return;
    }
    this.toastr.clear();

    this.afterSubmitCheck();

    this.submitted = false;
    if (this.questionnaire && this.step && !this.form.disabled && !this.step.chapter && !skipSave) {
      this.questionnaireService.updateInputs(this.form.value, this.questionnaire, this.step);
    }

    if (!this.step) {
      this.router.navigate([`/crash/${this.sessionId}`]);
      return;
    }

    // For now select first input of steps
    const input = this.questionnaire?.data.inputs[this.step?.inputs[0]];

    if (url) {
      this.router.navigate([url]);
      return;
    }

    if (input?.type === InputType.select) {
      const selectedOption: Option | undefined = input.options?.find(option => option.value === input.value);
      if (selectedOption?.action_property?.step) {
        this.router.navigate([`/crash/${this.sessionId}/questionnaires/${this.questionnaireId}/sections/${this.section?.id}/steps/${selectedOption?.action_property.step}`]);
        return;
      }
    }

    if (this.step?.next_step) {
      this.router.navigate([`/crash/${this.sessionId}/questionnaires/${this.questionnaireId}/sections/${this.section?.id}/steps/${this.step?.next_step}`]);
      return;
    }

    const previousSectionId = this.questionnaire?.data.sections.map(section => section.id).indexOf(this.section?.id || '');
    if (previousSectionId !== undefined) {
      const newSection = this.questionnaire?.data.sections[previousSectionId + 1];
      this.router.navigate([`/crash/${this.sessionId}/questionnaires/${this.questionnaireId}/sections/${newSection?.id}/steps/${newSection?.starting_step}`]);
      return;
    }
    this.router.navigate([`/crash/${this.sessionId}`]);
  }

  private afterSubmitCheck() {
    const observables = this.dynamicControlDirectives?.map(dynamicControlDirective => {
      const componentRef = dynamicControlDirective?.controlComponentRef;
      if (componentRef && typeof componentRef.instance.afterSubmit === 'function') {
        return componentRef.instance.afterSubmit().pipe(take(1));
      } else {
        return of(true);
      }
    });
    if (observables && observables.length > 0) {
      zip(observables).pipe(take(1)).subscribe();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
