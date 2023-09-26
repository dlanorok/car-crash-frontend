import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  BaseFormControlComponent,
  provideControlValueAccessor
} from "@app/shared/form-controls/base-form-control.component";
import { Step } from "@app/home/pages/crash/flow.definition";
import { CrashModel } from "@app/shared/models/crash.model";
import { Observable, take } from "rxjs";
import { CrashesApiService } from "@app/shared/api/crashes/crashes-api.service";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { Store } from "@ngrx/store";
import { StorageItem } from "@app/shared/common/enumerators/storage";
import { loadCrash } from "@app/app-state/crash/crash-action";
import { Router } from "@angular/router";

@Component({
  selector: 'app-final-step',
  templateUrl: './final-step.component.html',
  styleUrls: ['./final-step.component.scss'],
  providers: [provideControlValueAccessor(FinalStepComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinalStepComponent extends BaseFormControlComponent<boolean> implements OnInit {
  private readonly crashesApiService: CrashesApiService = inject(CrashesApiService);
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);

  @Input() step?: Step;

  @Output() back: EventEmitter<void> = new EventEmitter<void>();
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  crash$: Observable<CrashModel> = this.store.select(selectCrash);

  ngOnInit() {
    super.ngOnInit();
    const sessionId: string | null = localStorage.getItem(StorageItem.sessionId);
    if (!sessionId) {
      this.router.navigate(["/"]);
      return;
    }
    this.store.dispatch(loadCrash({sessionId}));
  }

  confirmCrash(crash: CrashModel) {
    this.handleModelChange(true);
    this.crashesApiService.confirmCrash(crash).pipe(take(1)).subscribe(() => {
      this.next.emit();
    });
  }
}
