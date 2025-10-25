import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MaintenancePageGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const fromGuard = route.queryParamMap.get('fromguard');
    if (fromGuard === '1') {
      return true;
    }
    // not allowed to open maintenance page directly
    return this.router.parseUrl('/');
  }
}


