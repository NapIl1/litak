import { Component, OnInit } from '@angular/core';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  FlightSteps = FlightSteps;
  flights: Flight[] = [];

  constructor(private flightService: FlightService) { }

  async ngOnInit(): Promise<void> {
    this.flights = await this.flightService.getAllFlightsAsync();
  }


}
