import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then(mod => mod.WelcomeModule),
  },
  {
    path: 'join',
    loadChildren: () => import('./pages/join-crash/join-crash.module').then(mod => mod.JoinCrashModule),
  },
  {
    path: 'scan',
    loadChildren: () => import('./pages/scan-qr-code/scan-qr-code.module').then(mod => mod.ScanQrCodeModule),
  },
  {
    path: 'crash/:sessionId',
    loadChildren: () => import('./pages/crash/crash.module').then(mod => mod.CrashModule),
  },
  {
    path: 'crash/:sessionId/accident-data',
    loadChildren: () => import('./pages/accident-report-flow/accident-data/accident-data.module').then(mod => mod.AccidentDataModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/circumstances',
    loadChildren: () => import('./pages/accident-report-flow/car-data/circumstances/circumstances.module').then(mod => mod.CircumstancesModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/damaged-parts',
    loadChildren: () => import('./pages/accident-report-flow/car-data/damaged-parts/damaged-parts.module').then(mod => mod.DamagedPartsModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/initial-impact',
    loadChildren: () => import('./pages/accident-report-flow/car-data/initial-impact/initial-impact.module').then(mod => mod.InitialImpactModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId',
    loadChildren: () => import('./pages/accident-report-flow/car/car.module').then(mod => mod.CarModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/policy-holder',
    loadChildren: () => import('./pages/accident-report-flow/car-data/policy-holder/policy-holder.module').then(mod => mod.PolicyHolderModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/driver',
    loadChildren: () => import('./pages/accident-report-flow/car-data/driver/driver.module').then(mod => mod.DriverModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/insurance-company',
    loadChildren: () => import('./pages/accident-report-flow/car-data/insurance/insurance.module').then(mod => mod.InsuranceModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
