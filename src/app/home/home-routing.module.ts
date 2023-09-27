import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then(mod => mod.WelcomeModule),
  },
  {
    path: 'crash/:sessionId/join',
    loadChildren: () => import('./pages/join-crash/join-crash.module').then(mod => mod.JoinCrashModule),
  },
  {
    path: 'crash/:sessionId',
    loadChildren: () => import('./pages/crash/crash.module').then(mod => mod.CrashModule),
  },
  {
    path: 'crash/:sessionId/pdf-preview',
    loadChildren: () => import('./pages/pdf-preview/pdf-preview.module').then(mod => mod.PdfPreviewModule),
  },
  {
    path: 'crash/:sessionId/questionnaires/:questionnaireId/sections/:sectionId/steps/:stepType',
    loadChildren: () => import('./pages/step/step.module').then(mod => mod.StepModule),
  },
  {
    path: 'final',
    loadChildren: () => import('./pages/final/final.module').then(mod => mod.FinalModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
