import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {

  private isMaintenance = true; // toggle to false to disable maintenance mode

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.isMaintenance) {
      this.router.navigate(['/maintenance']);
      return false;
    }
    return true;
  }
}
