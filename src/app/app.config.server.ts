import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom, APP_INITIALIZER, Optional } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// translate-fs-loader is provided from './shared/translate-fs-loader'
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateFsLoader } from './shared/translate-fs-loader';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { DOCUMENT } from '@angular/common';

export function ServerTranslateLoaderFactory(): any {
  return new TranslateFsLoader('assets/i18n/', '.json');
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // initialise language on the server from the incoming request URL (e.g. /he/...)
    // set document language and dir on server during bootstrap
    {
      provide: APP_INITIALIZER,
      useFactory: (doc: Document) => {
        return () => {
          try {
            // server-side Document should have a location with the current pathname
            const path = (doc && (doc as any).location && (doc as any).location.pathname) ? String((doc as any).location.pathname) : '';
            const lang = path.startsWith('/he') ? 'he' : 'en';
            if (doc && doc.documentElement) {
              doc.documentElement.lang = lang;
              doc.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
            }
          } catch {}
          return Promise.resolve();
        };
      },
      deps: [DOCUMENT],
      multi: true
    },
    // Ensure translations are loaded on the server before rendering
    {
      provide: APP_INITIALIZER,
      useFactory: (doc: Document, translate: TranslateService, loader: TranslateLoader) => {
        return () => {
          try {
            const path = (doc && (doc as any).location && (doc as any).location.pathname) ? String((doc as any).location.pathname) : '';
            const lang = path.startsWith('/he') ? 'he' : 'en';
            // loader.getTranslation may return an Observable
            const maybe = loader.getTranslation(lang) as any;
            if (maybe && typeof maybe.toPromise === 'function') {
              return maybe.toPromise().then((translations: any) => {
                try { translate.setTranslation(lang, translations, true); translate.use(lang); } catch {}
              }).catch(() => Promise.resolve());
            } else if (maybe && typeof maybe.subscribe === 'function') {
              return new Promise((res) => maybe.subscribe((t: any) => { try { translate.setTranslation(lang, t); translate.use(lang); } catch {} ; res(null); }, () => res(null)));
            }
          } catch {}
          return Promise.resolve();
        };
      },
      deps: [DOCUMENT, TranslateService, TranslateLoader],
      multi: true
    },
    provideClientHydration(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: { provide: TranslateLoader, useFactory: ServerTranslateLoaderFactory }
      })
    ),
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
