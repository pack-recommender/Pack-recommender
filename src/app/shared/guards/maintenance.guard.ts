import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {

  // Toggle to true to enable maintenance mode. Left false by default so the site is accessible.
  private isMaintenance = true;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {

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


    // Extract test param from URL
    const storageAvailable = isPlatformBrowser(this.platformId);
    const urlParams = new URLSearchParams(state.url.split('?')[1] || '');
    const localStorageValue = storageAvailable ? localStorage.getItem('testValue') : null;
    const testValue = urlParams.get('test') || localStorageValue || '';

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
      const lang = langFromUrl || (isPlatformBrowser(this.platformId) ? (localStorage.getItem('lang') || 'en') : 'en');
      // If running in the browser, do a hard redirect to the absolute path to
      // guarantee no double-prefixing (prevents /en/en/maintenance). For server
      // contexts, return an UrlTree so Angular can handle it.
      if (isPlatformBrowser(this.platformId)) {
        try {
          location.replace(`/${lang}/maintenance`);
        } catch (e) {}
        return false;
      }
      return this.router.parseUrl(`/${lang}/maintenance`);
    }

  }
}
