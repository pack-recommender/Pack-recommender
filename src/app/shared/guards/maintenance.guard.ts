import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {

  private isMaintenance = true; // toggle to false to disable maintenance mode

  constructor(private router: Router) {}

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
    const testValue = urlParams.get('test') || localStorage.getItem('testValue') || '';
    localStorage.setItem('testValue', testValue);  
    if (testValue === testParam) { 
      return true; // bypass maintenance if date param matches today
    }


   // Otherwise, redirect to /maintenance
    return this.router.createUrlTree(['/maintenance']);
  }
}
