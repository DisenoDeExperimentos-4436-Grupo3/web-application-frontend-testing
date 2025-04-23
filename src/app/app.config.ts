import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { withInterceptors } from "@angular/common/http";
import { authenticationInterceptor } from "./iam/services/authentication.interceptor";
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { HttpClient, provideHttpClient } from "@angular/common/http";
import { importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),provideHttpClient(),
                                                                                                                     importProvidersFrom(
                                                                                                                       TranslateModule.forRoot({
                                                                                                                         loader: {
                                                                                                                           provide: TranslateLoader,
                                                                                                                           useFactory: HttpLoaderFactory,
                                                                                                                           deps: [HttpClient]
                                                                                                                         }
                                                                                                                       })
                                                                                                                     ), provideAnimationsAsync(),
                                                                                                                   provideHttpClient( withInterceptors([authenticationInterceptor]) ),
]
};
