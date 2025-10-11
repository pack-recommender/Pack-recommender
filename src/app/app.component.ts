import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService, LanguageOption } from './shared/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'packrecommender';

  dropdownOpen = false;
  currentLang = 'en';
  canChangeLang = true;

  

  private langSub?: Subscription;

  constructor(private langService: LanguageService) {
  }

  ngOnInit(): void {
    this.langSub = this.langService.language$.subscribe((lang) => {
      this.currentLang = this.langService.getDisplayLang(lang);
    });
    // subscribe to language switching availability
    this.langService.canChangeLanguage$.subscribe((v) => this.canChangeLang = v);
    this.langService.initLanguage();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  changeLang(lang: string) {
    this.langService.setLanguage(lang);
    this.dropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  get languages(): LanguageOption[] {
    return this.langService.getLanguages();
  }
}
