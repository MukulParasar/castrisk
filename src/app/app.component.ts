import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Add RouterLink here
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanComponent } from './plan/plan.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HomeComponent, MapComponent, DashboardComponent, PlanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}