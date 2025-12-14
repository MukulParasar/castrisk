import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { PlanComponent } from './plan/plan.component';
// --> NEW: Import the PersonalPlannerComponent we just created
import { PersonalPlannerComponent } from './personal-planner/personal-planner.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapComponent },
  // --> NEW: This line tells the app to load our new component for the /planner URL
  { path: 'planner', component: PersonalPlannerComponent },
  // This is the old route for viewing pre-defined plans from the map
  { path: 'plan/:id', component: PlanComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
