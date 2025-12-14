import { Component, AfterViewInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {

  private map: any;
  public selectedLocation: any;
  public isLoading: boolean = true; // <-- NEW: Property to track loading state

  constructor(private apiService: ApiService, private router: Router) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.fetchAndDisplayRiskPoints();
    this.addLegend();
  }

  private initMap(): void {
    const dehradunCoords: L.LatLngExpression = [30.3165, 78.0322];
    this.map = L.map('map', {
      center: dehradunCoords,
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  private getStyleForRisk(score: number) {
    if (score > 60) {
      return { radius: score * 10, color: '#FF4136', fillColor: '#FF4136' };
    }
    if (score > 40) {
      return { radius: score * 10, color: '#FF851B', fillColor: '#FF851B' };
    }
    return { radius: score * 10, color: '#2ECC40', fillColor: '#2ECC40' };
  }

  private fetchAndDisplayRiskPoints(): void {
    this.isLoading = true; // <-- NEW: Set loading to true before API call
    this.apiService.getRiskData().subscribe({
      next: (geojsonData: any) => {
        const geoJsonLayer = L.geoJSON(geojsonData, {
          pointToLayer: (feature, latlng) => {
            const styles = this.getStyleForRisk(feature.properties.risk_score);
            return L.circle(latlng, {
              radius: styles.radius,
              color: styles.color,
              weight: 2,
              fillColor: styles.fillColor,
              fillOpacity: 0.5
            });
          },
          onEachFeature: (feature: any, layer: any) => {
            layer.on({
              click: () => {
                this.selectedLocation = feature;
              }
            });

            if (feature.properties) {
              const popupContent = `<b>Area:</b> ${feature.properties.area}<br><b>Risk:</b> ${feature.properties.risk_score}`;
              layer.bindPopup(popupContent);
            }
          }
        }).addTo(this.map);

        this.map.fitBounds(geoJsonLayer.getBounds());
        this.isLoading = false; // <-- NEW: Set loading to false on success
      },
      error: (error) => {
        console.error('Error fetching risk data:', error);
        this.isLoading = false; // <-- NEW: Also set loading to false on error
      }
    });
  }

  public viewPlan(): void {
    if (this.selectedLocation) {
      const planId = this.selectedLocation.properties.mitigation_plan_id;
      this.router.navigate(['/plan', planId]);
    }
  }

  private addLegend(): void {
    const legend = new (L.Control.extend({
      options: { position: 'bottomright' }
    }));

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const labels = ['<strong>Risk Level</strong>'];
      const categories = ['Low (< 41)', 'Moderate (41-60)', 'High (> 60)'];
      const colors = ['#2ECC40', '#FF851B', '#FF4136'];

      div.innerHTML = `
        <style>
          .info.legend {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            line-height: 24px;
            color: #555;
          }
          .info.legend i {
            width: 20px;
            height: 20px;
            float: left;
            margin-right: 8px;
            opacity: 0.7;
            border-radius: 50%;
          }
        </style>
      `;

      for (let i = 0; i < categories.length; i++) {
        labels.push(
          `<i style="background:${colors[i]}"></i> ${categories[i]}`
        );
      }
      div.innerHTML += labels.join('<br>');
      return div;
    };

    legend.addTo(this.map);
  }
}

