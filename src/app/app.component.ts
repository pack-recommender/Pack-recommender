import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'packrecommender';

  dropdownOpen = false;
  // derive currentLang from document (set by the server for localized builds)
  currentLang = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) ? document.documentElement.lang : 'en';
  canChangeLang = true;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // ensure TranslateService uses the server-rendered language (document.lang) so client loads correct translations
    try {
      const lang = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) ? document.documentElement.lang : 'en';
      this.translate.use(lang);
      this.currentLang = lang;
    } catch (e) {
      this.translate.use('en');
    }
  }

  // language switching removed; site is localized at build time (AOT)
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  changeLang(lang: string) {
    // for AOT builds, language is determined by URL; redirect to locale path
    // strip any existing lang prefix to avoid doubling (e.g. /he/en/...)
    try {
      const p = (typeof location !== 'undefined' && location.pathname) ? location.pathname : '/';
      const rest = p.replace(/^\/(en|he)(?=\/|$)/, '') || '/';
      // ensure single leading slash
      const target = `/${lang}${rest.startsWith('/') ? rest : '/' + rest}`;
      location.replace(target);
    } catch (e) {
      location.replace(`/${lang}/`);
    }
  }
}
