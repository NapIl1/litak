import { Component, OnInit } from '@angular/core';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flights-stats',
  templateUrl: './flights-stats.component.html',
  styleUrls: ['./flights-stats.component.scss']
})
export class FlightsStatsComponent implements OnInit {

  flights: Flight[] = [];

  firstPart: Flight[] = [];
  secondPart: Flight[] = [];

  isExpanded = false;
  expanded: Flight | null = null;

  FlightSteps = FlightSteps;

  constructor(private flightService: FlightService) {}

  async ngOnInit(): Promise<void> {
    await this.getAllFlights();
  }

  async removeFlight(id: string | undefined) {
    if(id) {
      await this.flightService.removeFlight(id);
      await this.getAllFlights();

    }
    
  }

  async getAllFlights() {
    this.flights = await this.flightService.getAllFlightsAsync();

    this.firstPart = [...this.flights];

  }

  expand(i: number) {
    if(this.expanded) {
      this.expanded = null;
      this.firstPart = [...this.flights];
      this.secondPart = [];

      return;
    }


    
    this.expanded = this.flights[i];
    this.firstPart = [...this.flights];
    this.secondPart = [...this.firstPart.splice(i+1)];
  }

}
