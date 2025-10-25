import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceGuard } from './shared/guards/maintenance.guard';

export const routes: Routes = [
    // root maintenance (no lang prefix)
    { path: 'maintenance', component: MaintenanceComponent },

    // root landing (no lang prefix)
    { path: '', component: LandingComponent, canActivate: [MaintenanceGuard] },

    // localized routes with language prefix (e.g. /en, /he)
    {
        path: ':lang',
        children: [
            { path: '', component: LandingComponent, canActivate: [MaintenanceGuard] },
            { path: 'services', component: LandingComponent, data: { title: 'Services - PackRecommender', description: 'Our services and offerings.' }, canActivate: [MaintenanceGuard] },
            { path: 'aboutus', component: LandingComponent, data: { title: 'About Us - PackRecommender', description: 'About PackRecommender and our mission.' }, canActivate: [MaintenanceGuard] },
            { path: 'numbers', component: LandingComponent, data: { title: 'Numbers - PackRecommender', description: 'Our achievements and metrics.' }, canActivate: [MaintenanceGuard] },
            { path: 'gallery', component: LandingComponent, data: { title: 'Gallery - PackRecommender', description: 'Gallery and visuals.' }, canActivate: [MaintenanceGuard] },
            { path: 'workwithus', component: LandingComponent, data: { title: 'Work With Us - PackRecommender', description: 'How to work with PackRecommender.' }, canActivate: [MaintenanceGuard] },
            { path: 'contactus', component: LandingComponent, data: { title: 'Contact - PackRecommender', description: 'Contact PackRecommender.' }, canActivate: [MaintenanceGuard] },
            { path: 'maintenance', component: MaintenanceComponent }
        ]
    },

    // fallback
    { path: '**', component: NotFoundComponent, canActivate: [MaintenanceGuard] }
];
