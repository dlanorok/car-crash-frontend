import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then(mod => mod.WelcomeModule),
  },
  {
    path: 'crash/:sessionId',
    loadChildren: () => import('./pages/crash/crash.module').then(mod => mod.CrashModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId',
    loadChildren: () => import('./pages/car/car.module').then(mod => mod.CarModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/policy-holder',
    loadChildren: () => import('./pages/policy-holder/policy-holder.module').then(mod => mod.PolicyHolderModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/driver',
    loadChildren: () => import('./pages/driver/driver.module').then(mod => mod.DriverModule),
  },
  {
    path: 'crash/:sessionId/cars/:carId/insurance-company',
    loadChildren: () => import('./pages/insurance/insurance.module').then(mod => mod.InsuranceModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
