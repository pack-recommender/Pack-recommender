import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateFsLoader } from './shared/translate-fs-loader';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

export function ServerTranslateLoaderFactory(): TranslateLoader {
  return new TranslateFsLoader('assets/i18n/', '.json');
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: ServerTranslateLoaderFactory,
          deps: []
        }
      })
    ),
    provideClientHydration(),
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
