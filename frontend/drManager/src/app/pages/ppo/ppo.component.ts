import { Component, OnInit } from '@angular/core';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-ppo',
  templateUrl: './ppo.component.html',
  styleUrls: ['./ppo.component.scss']
})
export class PpoComponent implements OnInit {

  flights: Flight[] = [];

  options: DroneOptions = {};


  constructor(private flightService: FlightService,
              private optionsService: OptionsService) {

  }

  async ngOnInit(): Promise<void> {
    await this.getOptions()
    await this.getFlights();
  }

  public async getOptions() {
    this.options = await this.optionsService.getAllOptions();
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

  public async discard(id: string | undefined) {
    if (id) {
      const flightToUpdate = this.flights.find(x => x._id == id);

      if (flightToUpdate) {
        flightToUpdate.isRejected = true;
        flightToUpdate.rejectedReason = prompt("Введіть причину заборони") ?? undefined;
        await this.flightService.updateFlightAsync(flightToUpdate);
      }
    }

    await this.getFlights();
  }

  async getFlights() {
    this.flights = [];

    const allFlights = await this.flightService.getAllFlightsAsync();

    const filtered = allFlights.filter(x => x.flightStep.step !== FlightSteps.END);

    this.flights.push(...filtered.filter(x => x.flightStep.isApproved === false))

    this.options.dronAppointment?.forEach(c => {
      this.flights.push(...filtered.filter(x => x.flightStep.isApproved === true && x.assignment?.name === c.name));
    });

  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
