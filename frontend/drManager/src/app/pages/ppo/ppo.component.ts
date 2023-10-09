import { Component, OnInit } from '@angular/core';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-ppo',
  templateUrl: './ppo.component.html',
  styleUrls: ['./ppo.component.scss']
})
export class PpoComponent implements OnInit {
  
  flights: Flight[] = [];

  /**
   *
   */
  constructor(private flightService: FlightService) {
    
  }

  ngOnInit(): void {

    this.flights = this.flightService.getAllFlights();

    this.flights.push(...this.flights);
    this.flights.push(...this.flights);
    this.flights.push(...this.flights);

  }

  public approve(id: string) {

    this.flightService.approve(id);

    this.flights = this.flightService.getAllFlights();

    
    
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
