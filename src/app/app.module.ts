import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core';
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
import { NavigationHeaderModule } from "./shared/components/navigation-header/navigation-header.module";
import { CookieService } from "ngx-cookie-service";
import { sketchReducer } from "@app/app-state/sketch/sketch-reducer";
import { SketchEffects } from "@app/app-state/sketch/sketch-effects";
import { ToastrModule } from "ngx-toastr";
import { FooterButtonsModule } from "@app/shared/components/footer-buttons/footer-buttons.module";
import { AppLoadService } from "@app/app-load.service";
import { IconSpriteModule } from "ng-svg-icon-sprite";

export function initApp(appLoadService: AppLoadService): () => void {
  return () => appLoadService.initApp();
}

@NgModule({
  declarations: [
    AppComponent,
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
    StoreModule.forRoot({crashStore: crashReducer, carStore: carReducer, sketchStore: sketchReducer}),
    EffectsModule.forRoot(CrashEffects, CarEffects, SketchEffects),
    ApiModule,
    NavigationHeaderModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    FooterButtonsModule,
    IconSpriteModule
  ],
  providers: [
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [AppLoadService], multi: true },
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
