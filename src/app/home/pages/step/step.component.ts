import { Component, inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { distinctUntilChanged, mergeMap, of, Subject, take, takeUntil, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { QuestionnaireService } from "@app/shared/services/questionnaire.service";
import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";
import { Action, Input, InputType, Option, Section, Step, StepType } from "@app/home/pages/crash/flow.definition";
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
import { TranslocoService } from "@ngneat/transloco";
import { DialogService } from "@app/shared/services/dialog/dialog.service";
import { HelpTextComponent } from "@app/shared/components/ui/help-text/help-text.component";
import { HelpTextModule } from "@app/shared/components/ui/help-text/help-text.module";

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
  protected readonly dialogService: DialogService = inject(DialogService);
  protected readonly injector: Injector = inject(Injector);

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

  @ViewChild(DynamicControlDirective) private readonly dynamicControlDirective?: DynamicControlDirective<any>;

  ngOnInit(): void {
    this.getData();
    this.subscribeToQuestionnaire();
  }

  private subscribeToQuestionnaire() {
    this.questionnaireService.questionnaireUpdates$.pipe(
      untilDestroyed(this)
    ).subscribe((questionnaire) => {
      if (questionnaire && questionnaire.id === this.questionnaire?.id) {
        this.questionnaire = questionnaire;
        this.updateControls(true);
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
                  this.pageDataService.pageData = {
                    pageName: this.section?.name || '',
                    footerButtons: [
                      {
                        name$: this.translateService.selectTranslate('car-crash.shared.button.back'),
                        action: () => {
                          this.previous();
                        },
                        icon: 'bi-chevron-left'
                      },
                      {
                        name$: this.translateService.selectTranslate('car-crash.shared.button.overview'),
                        action: () => {
                          this.home();
                        },
                        icon: 'bi-house'
                      },
                      {
                        name$: this.translateService.selectTranslate('car-crash.shared.button.next'),
                        action: () => {
                          this.next();
                        },
                        icon: 'bi-chevron-right'
                      },
                    ]
                  };
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

      if (input.type === InputType.sketch) {
        if (this.questionnaire && control.value.save && this.step) {
          control.value.save = false;
          this.questionnaireService.updateInputs(value, this.questionnaire, this.step);
        }
      } else if (input.type === InputType.place) {
        this.next();
      }

      if (input.value !== control.value) {
        control.markAsTouched();
      }
    });
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
    const componentRef = this.dynamicControlDirective?.controlComponentRef;
    if (componentRef && typeof componentRef.instance.beforeBack === 'function') {
      componentRef.instance.beforeBack().pipe(
        take(1),
        tap((canContinue: boolean) => {
          if (canContinue) {
            if (this.checkFormTouched()) {
              this.location.back();
            }
          }
        })
      ).subscribe();
    } else {
      if (this.checkFormTouched()) {
        this.location.back();
      }
    }
  }

  next(url?: string): void {
    const componentRef = this.dynamicControlDirective?.controlComponentRef;
    if (componentRef && typeof componentRef.instance.beforeSubmit === 'function') {
      componentRef.instance.beforeSubmit().pipe(
        take(1),
        tap((canContinue: boolean) => {
          if (canContinue) {
            this.afterNext(url);
          }
        })
      ).subscribe();
    } else {
      this.afterNext(url);
    }

  }

  private afterNext(url?: string) {
    this.submitted = true;
    updateEntireFormValidity(this.form);

    if (!this.form?.valid && !this.form.disabled) {
      this.toastr.error('§§ This field is required');
      return;
    }
    this.toastr.clear();

    this.submitted = false;
    if (this.questionnaire && this.step && !this.form.disabled) {
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

  openInfoModal(step: Step) {
    this.dialogService.openDialog({
      componentData: {
        component: HelpTextComponent,
        module: HelpTextModule,
        parentInjector: this.injector
      },
      componentParams: {
        step: step
      },
      options: {
        size: 'xl',
        centered: true
      },
      isClosable: true,
      title$: of("§§ help")
    }).pipe(take(1)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
