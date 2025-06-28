import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceGuard } from './shared/guards/maintenance.guard';

export const routes: Routes = [
    { path: 'maintenance', component: MaintenanceComponent },
    { path: '', component: LandingComponent, canActivate: [MaintenanceGuard]
     },
    {
        path: '**', component: NotFoundComponent, canActivate: [MaintenanceGuard]
    }
];
