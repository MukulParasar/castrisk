import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  riskData: any; // A variable to store the risk data from the API

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Call the API when the component is initialized
    this.getRiskData();
  }

  getRiskData() {
    this.apiService.getRiskData().subscribe({
      next: (data) => {
        this.riskData = data; // Store the data in the riskData variable
      },
      error: (error) => {
        console.error('Error fetching risk data:', error);
      }
    });
  }
}