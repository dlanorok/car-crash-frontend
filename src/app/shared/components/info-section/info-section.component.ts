import { Component, inject, Injector, Input } from '@angular/core';
import { Step } from "@app/home/pages/crash/flow.definition";
import { HelpTextComponent } from "@app/shared/components/ui/help-text/help-text.component";
import { HelpTextModule } from "@app/shared/components/ui/help-text/help-text.module";
import { of, take } from "rxjs";
import { DialogService } from "@app/shared/services/dialog/dialog.service";

@Component({
  selector: 'app-info-section',
  templateUrl: './info-section.component.html',
  styleUrls: ['./info-section.component.scss']
})
export class InfoSectionComponent {
  protected readonly dialogService: DialogService = inject(DialogService);
  protected readonly injector: Injector = inject(Injector);

  @Input() step!: Step;
  @Input() isSmall?: boolean;

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
}
