import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService, LanguageOption } from './shared/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'packrecommender';

  dropdownOpen = false;
  currentLang = 'en';

  

  constructor(private langService: LanguageService) {
    this.langService.initLanguage();
    this.currentLang = this.langService.getCurrentLang();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  changeLang(lang: string) {
    this.langService.setLanguage(lang);
    this.currentLang = this.langService.getCurrentLang();
    this.dropdownOpen = false;
  }

  get languages(): LanguageOption[] {
    return this.langService.getLanguages();
  }
}
