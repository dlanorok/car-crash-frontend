import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from "@ngrx/store";
import { crashReducer } from "./app-state/crash/crash-reducer";
import { EffectsModule } from "@ngrx/effects";
import { CrashEffects } from "./app-state/crash/crash-effects";
import { ApiModule } from "./shared/api/api.module";
import { carReducer } from "./app-state/car/car-reducer";
import { CarEffects } from "./app-state/car/car-effects";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot({ crashStore: crashReducer , carStore: carReducer}),
    EffectsModule.forRoot(CrashEffects, CarEffects),
    ApiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
