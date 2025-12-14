import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent implements OnInit {
  plan: any;

  // A dictionary of all available mitigation plans
  private allPlans: { [key: string]: any } = {
    'plan_001': {
      title: 'Mitigation Plan for Prem Nagar',
      description: 'Area with moderate flood risk due to proximity to the Asan river and several canals.',
      steps: [
        'Step 1: Reinforce riverbanks with gabion walls at critical erosion points.',
        'Step 2: Implement a regular schedule for dredging and clearing local canals.',
        'Step 3: Establish an early-warning system based on upstream river water levels.',
        'Step 4: Conduct community drills for evacuation to designated safe zones on higher ground.'
      ]
    },
    'plan_002': {
      title: 'Mitigation Plan for Special Wing, Prem Nagar',
      description: 'Residential area with moderate risk from an older drainage infrastructure that can be overwhelmed during heavy rainfall.',
      steps: [
        'Step 1: Upgrade storm drains to a larger capacity in choke-point areas.',
        'Step 2: Promote the use of permeable pavements for new constructions to reduce surface runoff.',
        'Step 3: Launch a public awareness campaign on not disposing of waste in drains.',
        'Step 4: Install backflow prevention valves in the sewage system to prevent contamination during floods.'
      ]
    },
    'plan_003': {
      title: 'Mitigation Plan for FRI & College Area',
      description: 'Campus area with moderate risk from natural streams that can overflow their banks.',
      steps: [
        'Step 1: Create natural retention ponds to slow down and store excess water flow.',
        'Step 2: Ensure all culverts under campus roads are regularly inspected and cleared of debris.',
        'Step 3: Develop a specific campus-wide alert system for students and staff.',
        'Step 4: Identify and clearly mark safe assembly points within the campus on higher ground.'
      ]
    },
    'plan_004': {
      title: 'Mitigation Plan for Clement Town',
      description: 'Area with significant paved surfaces leading to high-velocity water runoff.',
      steps: [
        'Step 1: Construct roadside bioswales to capture and filter stormwater runoff.',
        'Step 2: Mandate rainwater harvesting systems for all large institutional buildings.',
        'Step 3: Increase green cover by planting more trees along roads and in open spaces.',
        'Step 4: Use traffic management plans to close vulnerable underpasses during heavy rain alerts.'
      ]
    },
    'plan_005': {
      title: 'Mitigation Plan for Rajpur Road',
      description: 'Commercial and residential corridor at risk from the overflowing Rispana river.',
      steps: [
        'Step 1: Construct a protective embankment along vulnerable sections of the river.',
        'Step 2: Prohibit new construction within a designated setback distance from the river.',
        'Step 3: Install automated flood gates to control water flow into adjacent residential areas.',
        'Step 4: Equip all commercial establishments with emergency preparedness kits.'
      ]
    },
    'plan_006': {
      title: 'Mitigation Plan for Sahastradhara Road',
      description: 'Area with significant tourist traffic and hillside residential zones, vulnerable to landslides triggered by waterlogging.',
      steps: [
        'Step 1: Strengthen retaining walls along hillside roads and conduct regular geological stability checks.',
        'Step 2: Ensure all hotels and guest houses have clear emergency evacuation plans for tourists.',
        'Step 3: Clear debris from mountain streams and channels that cross the main road.',
        'Step 4: Install warning signs for landslide-prone areas and monitor soil saturation levels.'
      ]
    },
    'plan_007': {
      title: 'Mitigation Plan for Maldevta',
      description: 'Popular tourist and picnic spot at risk of sudden flash floods from cloudbursts in the upper catchment areas.',
      steps: [
        'Step 1: Install a weather monitoring station with an automated siren system for flash flood warnings.',
        'Step 2: Prohibit parking and temporary stalls within the immediate riverbed area.',
        'Step 3: Create designated, elevated safe zones for tourists and vendors.',
        'Step 4: Train local police and vendors in rapid evacuation procedures.'
      ]
    },
    'plan_008': {
      title: 'Mitigation Plan for Paltan Bazaar',
      description: 'High-risk, low-lying market area with extremely poor drainage.',
      steps: [
        'URGENT: Immediately begin a project to redesign and rebuild the central drainage channel.',
        'Step 2: Raise the height of shop entrances and install flood barriers for storefronts.',
        'Step 3: Create a multi-story evacuation shelter nearby for shopkeepers and residents.',
        'Step 4: Ban the use of plastic bags and other materials that frequently clog the drainage system.'
      ]
    },
    'plan_009': {
      title: 'Mitigation Plan for Vasant Vihar',
      description: 'Low-risk, well-planned residential area.',
      steps: [
        'Step 1: Continue regular maintenance and inspection of the modern drainage network.',
        'Step 2: Promote community awareness programs on emergency preparedness.',
        'Step 3: Ensure green parks and open spaces are maintained to absorb rainwater.',
        'Step 4: Establish a neighborhood watch program for emergency communication.'
      ]
    },
    'plan_010': {
      title: 'Mitigation Plan for ISBT Area',
      description: 'Moderate risk area with large paved surfaces.',
      steps: [
        'Step 1: Construct a large underground water retention tank to capture runoff from the bus terminal.',
        'Step 2: Ensure the main canal is regularly desilted, especially before the monsoon season.',
        'Step 3: Create a coordinated traffic diversion plan for when the main access road floods.',
        'Step 4: Display emergency contact numbers and evacuation routes prominently within the bus terminal.'
      ]
    },
    'plan_011': {
      title: 'Mitigation Plan for Raipur',
      description: 'Rapidly developing area with moderate risk due to impacted drainage.',
      steps: [
        'Step 1: Enforce strict building codes that require new developments to include integrated drainage solutions.',
        'Step 2: Preserve and protect remaining natural streams and green belts.',
        'Step 3: Develop a master drainage plan for the entire area to guide future development.',
        'Step 4: Increase the number of and capacity of cross-drainage culverts under new roads.'
      ]
    },
    // --- NEW PLANS START HERE ---
    'plan_012': {
      title: 'Mitigation Plan for Karanpur',
      description: 'High-risk, dense commercial area near the Rispana river.',
      steps: [
        'URGENT: Install a high-capacity water pump at the lowest point of the market to actively remove floodwater.',
        'Step 2: Mandate all shops to elevate their stock and electrical equipment at least 2 feet off the ground.',
        'Step 3: Establish a merchant-led early warning communication tree using SMS or WhatsApp.',
        'Step 4: Designate the nearby Parade Ground as the official evacuation and relief center.'
      ]
    },
    'plan_013': {
      title: 'Mitigation Plan for Ballupur Chowk',
      description: 'Moderate risk at a major traffic intersection prone to severe waterlogging.',
      steps: [
        'Step 1: Re-engineer the intersection\'s drainage to handle a higher volume of water flow.',
        'Step 2: Install sensors that automatically activate warning lights when water levels become dangerous for small vehicles.',
        'Step 3: Create pre-defined alternative routes and communicate them to the public during alerts.',
        'Step 4: Ensure traffic police are equipped with the necessary resources to manage diversions effectively.'
      ]
    },
    'plan_014': {
      title: 'Mitigation Plan for Dalanwala',
      description: 'Low-risk, posh residential area with good green cover.',
      steps: [
        'Step 1: Conduct annual trimming of large, old trees to prevent branches from falling and blocking drains during storms.',
        'Step 2: Encourage residents to maintain clear roof gutters and property-level drainage.',
        'Step 3: Map all storm drains in the area and ensure they are covered by the municipal cleaning schedule.',
        'Step 4: Use the area as a model for showcasing effective urban green infrastructure.'
      ]
    }
  };

  // Inject ActivatedRoute and Router
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(params => {
      const planId = params.get('id');
      if (planId) {
        this.plan = this.allPlans[planId];
      }
    });
  }

  // Function to navigate back to the map
  goBack(): void {
    this.router.navigate(['/map']);
  }
}

