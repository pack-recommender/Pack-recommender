import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom, APP_INITIALIZER, Optional } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// TranslateFsLoader removed; keep a safe stub for server builds
class TranslateFsLoader {
  constructor(prefix?: string, suffix?: string) {}
}
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
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
    provideClientHydration(),
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
