import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';

export class TranslateFsLoader implements TranslateLoader {
  constructor(private prefix = 'assets/i18n/', private suffix = '.json') {}

  getTranslation(lang: string): Observable<any> {
    try {
      // prerender produces files under dist/packrecommender/browser
      const file = join(process.cwd(), 'dist', 'packrecommender', 'browser', this.prefix, `${lang}${this.suffix}`);
      const data = JSON.parse(readFileSync(file, 'utf8'));
      return of(data);
    } catch (e) {
      // fallback to empty translations if file not found
      return of({});
    }
  }
}


