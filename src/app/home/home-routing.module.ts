import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/create-crash/create-crash.module').then(mod => mod.CreateCrashModule),
  },
  {
    path: 'crash/:crashId',
    loadChildren: () => import('./pages/crash/crash.module').then(mod => mod.CrashModule),
  },
  {
    path: 'crash/:crashId/cars/:carId',
    loadChildren: () => import('./pages/car/car.module').then(mod => mod.CarModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
