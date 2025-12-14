import { Component, OnInit } from '@angular/core'; // <-- Import OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service'; // <-- Import the ApiService

@Component({
  selector: 'app-personal-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-planner.component.html',
  styleUrl: './personal-planner.component.css'
})
export class PersonalPlannerComponent implements OnInit { // <-- Implement OnInit
  form = {
    houseType: '',
    peopleCount: 1,
    location: null as GeolocationCoordinates | null
  };

  locationMessage = '';
  generatedPlan: any = null;
  isGenerating = false;
  private riskZones: any[] = []; // To store the risk zone data from the model

  // Inject the ApiService in the constructor
  constructor(private apiService: ApiService) { }

  // ngOnInit is a lifecycle hook that runs when the component is first loaded
  ngOnInit(): void {
    this.fetchRiskZones();
  }

  // --- NEW: Fetch the risk zone data from our backend ---
  private fetchRiskZones(): void {
    this.apiService.getRiskData().subscribe({
      next: (data) => {
        // --- THIS LINE IS FIXED ---
        this.riskZones = (data as any).features; // We tell TypeScript to trust us
        console.log('Risk zones loaded:', this.riskZones);
      },
      error: (err) => console.error('Failed to load risk zones:', err)
    });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      this.locationMessage = 'Requesting location...';
      navigator.geolocation.getCurrentPosition((position) => {
        this.form.location = position.coords;
        this.locationMessage = `Location captured: Lat ${position.coords.latitude.toFixed(2)}, Lon ${position.coords.longitude.toFixed(2)}`;
      }, (error) => {
        this.locationMessage = 'Unable to retrieve location. Please check browser permissions.';
        console.error('Geolocation error:', error);
      });
    } else {
      this.locationMessage = 'Geolocation is not supported by this browser.';
    }
  }

  generatePlan(): void {
    this.isGenerating = true;
    setTimeout(() => {
      const plan = this.createPlanLogic();
      this.generatedPlan = plan;
      this.isGenerating = false;
    }, 1500);
  }

  private createPlanLogic(): any {
    const { houseType, peopleCount, location } = this.form;

    // --- NEW: Check if the user is in a known risk zone ---
    const nearbyRiskZone = this.findNearbyRiskZone(location);

    const plan: any = {
      title: `Preparedness Plan for ${houseType}`,
      riskZoneInfo: nearbyRiskZone, // This will be null if they are not in a zone
      immediateActions: [],
      evacuationKit: [],
      evacuationRouteLink: ''
    };

    // --- UPDATED: Logic now changes based on risk zone ---
    if (nearbyRiskZone) {
      plan.title = `URGENT Plan for ${houseType} in ${nearbyRiskZone.properties.area}`;
      plan.immediateActions.push(`ALERT: Your location is within 500m of the identified '${nearbyRiskZone.properties.area}' flood risk zone.`);
      plan.immediateActions.push("Monitor official news sources for evacuation orders specific to your area.");
    } else {
       plan.immediateActions.push("Your immediate area is not within a pre-identified risk zone, but general preparedness is essential.");
    }

    if (houseType.includes('Apartment')) {
      plan.immediateActions.push("Check building evacuation routes and emergency exits.");
    } else {
      plan.immediateActions.push("Secure your property: lock doors and windows.");
      plan.immediateActions.push("Move valuable items to the highest possible floor.");
    }

    plan.evacuationKit.push(`Sufficient drinking water for ${peopleCount} person(s) for 72 hours.`);
    plan.evacuationKit.push("First-aid kit and essential medications.");
    plan.evacuationKit.push("Non-perishable food items.");
    plan.evacuationKit.push("Flashlights, radio, and extra batteries.");
    plan.evacuationKit.push("Copies of important documents in a waterproof bag.");

    if (location) {
      const safePointLat = 30.3255;
      const safePointLon = 78.0438;
      plan.evacuationRouteLink = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${safePointLat},${safePointLon}&travelmode=driving`;
    }

    return plan;
  }

  // --- NEW: Helper function to find the closest risk zone ---
  private findNearbyRiskZone(userLocation: GeolocationCoordinates | null): any {
    if (!userLocation || this.riskZones.length === 0) {
      return null;
    }

    let closestZone = null;
    let minDistance = Infinity;

    for (const zone of this.riskZones) {
      const zoneCoords = zone.geometry.coordinates;
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        zoneCoords[1], // GeoJSON is [lon, lat]
        zoneCoords[0]
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestZone = zone;
      }
    }

    // If the closest zone is within a 500-meter radius, we consider the user "in" the zone
    if (minDistance < 0.5) { // 0.5 kilometers
      return closestZone;
    }

    return null;
  }

  // --- NEW: Haversine formula to calculate distance between two lat/lon points in km ---
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  startOver(): void {
    this.generatedPlan = null;
    this.form = { houseType: '', peopleCount: 1, location: null };
    this.locationMessage = '';
  }
}

