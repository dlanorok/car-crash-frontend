import { QuestionnaireModel } from "@app/shared/models/questionnaire.model";

export function getStartingLink(questionnaire: QuestionnaireModel) {
  return `/crash/${questionnaire.crash.session_id}/questionnaires/${questionnaire.id}/sections/${questionnaire.data.sections[0].id}/steps/${questionnaire.data.sections[0].starting_step}`;
}
