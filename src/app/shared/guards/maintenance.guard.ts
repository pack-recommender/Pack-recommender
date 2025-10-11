import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {

  // Toggle to true to enable maintenance mode. Left false by default so the site is accessible.
  private isMaintenance = false;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.isMaintenance) {
      return true; // allow normal access
    }


    // Generate today's date in ddMMyyyy
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const testParam = `${day}${month}${year}`;


    // Extract test param from URL
    const urlParams = new URLSearchParams(state.url.split('?')[1] || '');
    const param = urlParams.get('test');
    const storageAvailable = isPlatformBrowser(this.platformId);
    const stored = storageAvailable ? localStorage.getItem('testValue') : null;
    const testValue = param || stored || '';
    if (storageAvailable) {
      try { localStorage.setItem('testValue', testValue); } catch {}
    }
    if (testValue === testParam) { 
      return true; // bypass maintenance if date param matches today
    }


   // Otherwise, redirect to /maintenance
    return this.router.createUrlTree(['/maintenance']);
  }
}
