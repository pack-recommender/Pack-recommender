import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

// Note: this loader is intended for server / prerender use where filesystem
// access is available. It reads translation JSON files synchronously from the
// built `dist/packrecommender/browser/assets/i18n` or `src/assets/i18n` as a
// fallback.
export class TranslateFsLoader implements TranslateLoader {
  constructor(private prefix = 'assets/i18n/', private suffix = '.json') {}

  getTranslation(lang: string): Observable<any> {
    try {
      // require here so this file can still be imported in browser builds
      // without failing at module evaluation time.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      const path = require('path');
      const cwd = process.cwd();

      // first try within the built browser dist (used for prerender)
      const candidate1 = path.join(cwd, 'dist', 'packrecommender', 'browser', this.prefix, `${lang}${this.suffix}`);
      if (fs.existsSync(candidate1)) {
        const raw = fs.readFileSync(candidate1, 'utf8');
        return of(JSON.parse(raw));
      }

      // fallback to source assets (useful during server dev)
      const candidate2 = path.join(cwd, 'src', 'assets', 'i18n', `${lang}${this.suffix}`);
      if (fs.existsSync(candidate2)) {
        const raw = fs.readFileSync(candidate2, 'utf8');
        return of(JSON.parse(raw));
      }

      return of({});
    } catch (e) {
      return of({});
    }
  }
}


