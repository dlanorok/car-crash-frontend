export interface ConfirmOrDeclineParams {
  message: string;
  description: string;
  hint?: string;
  confirmMessage: string;
  declineMessage: string;
  translationVariables?: Record<string, unknown>;
}
