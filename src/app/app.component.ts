import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// Subscription not needed after removing runtime language service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'packrecommender';

  dropdownOpen = false;
  currentLang = 'en';
  canChangeLang = true;

  

  // language switching removed; site is localized at build time (AOT)
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  changeLang(lang: string) {
    // for AOT builds, language is determined by URL; redirect to locale path
    window.location.href = `/${lang}/`;
  }
}
