import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsMyQuestionnairePipe } from "@app/shared/common/pipes/is-my-questionnaire/is-my-questionnaire.pipe";



@NgModule({
  declarations: [IsMyQuestionnairePipe],
  imports: [
    CommonModule
  ],
  exports: [IsMyQuestionnairePipe]
})
export class IsMyQuestionnaireModule { }
