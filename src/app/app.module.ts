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
import { TranslocoRootModule } from "./i18n/transloco-root.module";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDatepickerI18n
} from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from "./shared/form-controls/date-control/ngb-date-adapter";
import { CustomDatepickerI18n } from "./shared/form-controls/date-control/date-control-i18n";
import { MainLayoutComponent } from "./shared/layout/main-layout/main-layout.component";
import { NavigationHeaderModule } from "./shared/components/navigation-header/navigation-header.module";
import { CookieService } from "ngx-cookie-service";

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        TranslocoRootModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        StoreModule.forRoot({crashStore: crashReducer, carStore: carReducer}),
        EffectsModule.forRoot(CrashEffects, CarEffects),
        ApiModule,
        NavigationHeaderModule,
    ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
