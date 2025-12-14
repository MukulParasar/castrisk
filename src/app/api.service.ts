import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5030/api'; 

  constructor(private http: HttpClient) { }

  getSimulationData() {
    return this.http.get(`${this.apiUrl}/simulation`);
  }
  
  getRiskData() {
    return this.http.get(`${this.apiUrl}/risk`);
  }
  
  
  getPlanData() {
    return this.http.get(`${this.apiUrl}/plan`);
  }
}