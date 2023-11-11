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

  constructor(private flightService: FlightService) {

  }

  async ngOnInit(): Promise<void> {
    await this.getFlights();
  }

  public async approve(id: string | undefined) {

    if (id) {
      const flightToUpdate = this.flights.find(x => x._id == id);

      if (flightToUpdate) {
        flightToUpdate.flightStep.isApproved = true;
        await this.flightService.updateFlightAsync(flightToUpdate);
      }
    }

    await this.getFlights();
  }

  async getFlights() {
    const allFlights = await this.flightService.getAllFlightsAsync();
    this.flights = allFlights.filter(x => x.flightStep.step != FlightSteps.END);
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
