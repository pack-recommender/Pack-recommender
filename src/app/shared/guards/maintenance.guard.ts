import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../services/language.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {

  // Toggle to true to enable maintenance mode. Left false by default so the site is accessible.
  private isMaintenance = true;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object,
              private languageService: LanguageService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.isMaintenance) {
      return true; // allow normal access
    }

    // If the navigation only changes the URL fragment (anchor) on the same page,
    // allow it through so in-page anchors like `#services` still work.
    // const strip = (u: string) => (u || '').split('#')[0].split('?')[0] || '/';
    // const targetBase = strip(state.url);
    // const currentBase = strip(this.router.url);
    // if (targetBase === currentBase && state.url.includes('#')) {
    //   return true;
    // }


    // Generate today's date in ddMMyyyy
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const testParam = `${day}${month}${year}`;


    // If the navigation only changes the URL fragment (anchor) on the same page,
    // allow it through so in-page anchors like `#services` still work.
    const strip = (u: string) => (u || '').split('#')[0].split('?')[0] || '/';
    const targetBase = strip(state.url);
    const currentBase = strip(this.router.url);
    if (targetBase === currentBase && state.url.includes('#')) {
      return true;
    }

    // Extract test param from URL (preferred) and only read localStorage as a
    // fallback. We also cache the stored value to avoid repeated synchronous
    // reads which can add overhead during rapid navigations.
    const urlParams = new URLSearchParams(state.url.split('?')[1] || '');
    const paramTestValue = urlParams.get('test') || '';
    let localStorageValue: string | null = null;
    // cached read to avoid repeated localStorage access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (MaintenanceGuard as any)._cachedTestValue = (MaintenanceGuard as any)._cachedTestValue || null;
    const cached = (MaintenanceGuard as any)._cachedTestValue as string | null;
    if (!paramTestValue && !cached && isPlatformBrowser(this.platformId)) {
      try {
        localStorageValue = localStorage.getItem('testValue');
        (MaintenanceGuard as any)._cachedTestValue = localStorageValue;
      } catch (e) {
        localStorageValue = null;
      }
    }
    const testValue = paramTestValue || cached || localStorageValue || '';

    if (testValue === testParam) { 
      if(!localStorageValue) {
        localStorage.setItem('testValue', testValue);
      }
      return true; // bypass maintenance if date param matches today
    } else {
      //Otherwise, redirect to localized maintenance page (e.g. /he/maintenance)
      // If the requested URL already points to a localized maintenance page, allow it
      const alreadyLocalizedMaintenance = /^\/(en|he)\/maintenance(?:[?#]|$)/.test(state.url);
      if (alreadyLocalizedMaintenance) {
        return true;
      }

      // try to extract language prefix from URL (e.g. /he/...) else fall back to stored lang or 'en'
      const langFromUrlMatch = state.url.match(/^\/(en|he)(?:\/|$)/);
      const langFromUrl = langFromUrlMatch ? langFromUrlMatch[1] : null;
      // Prefer explicit language in URL; otherwise use the app's current
      // language from LanguageService (in-memory, synchronous) to avoid slow
      // localStorage reads during navigation.
      const lang = langFromUrl || this.languageService.getLangCode() || 'en';
      // build absolute UrlTree to avoid relative double-prefixing
      return this.router.parseUrl(`/${lang}/maintenance`);
    }

  }
}
