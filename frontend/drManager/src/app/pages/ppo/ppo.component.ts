import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ppo',
  templateUrl: './ppo.component.html',
  styleUrls: ['./ppo.component.scss']
})
export class PpoComponent implements OnInit, OnDestroy {

  flights: Flight[] = [];

  options: DroneOptions = {};
  userRole?: UserRole;
  refreshFlightSubscription?: Subscription;

  interval_ms = 5000;

  constructor(private flightService: FlightService,
              private optionsService: OptionsService,
              private userService: UserService) {

  }
  ngOnDestroy(): void {
    this.refreshFlightSubscription?.unsubscribe();
  }

  async ngOnInit(): Promise<void> {

    var ui = this.userService.getUserInfo();

    if (ui) {
      this.userRole = ui.role;
    }

    await this.getOptions()
    await this.getFlights();

    this.refreshFlightSubscription = interval(this.interval_ms).subscribe(async x => {
      await this.getFlights();
    })
  }

  public async getOptions() {
    this.options = await this.optionsService.getAllOptions();
  }

  public async approve(id: string | undefined) {

    if (id) {
      const flightToUpdate = this.flights.find(x => x._id == id);

      if (flightToUpdate) {

        if (this.userRole == UserRole.PPO) {
          flightToUpdate.flightStep.isApprovedByPPO = true;
        }

        if (this.userRole == UserRole.REB) {
          flightToUpdate.flightStep.isApprovedByREB = true;
        }

        if (flightToUpdate.flightStep.isApprovedByPPO == true && flightToUpdate.flightStep.isApprovedByREB == true) {
          flightToUpdate.flightStep.isApproved = true;
        }

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

        if (this.userRole == UserRole.PPO) {
          flightToUpdate.isRejectedbyPPO = true;
        }

        if (this.userRole == UserRole.REB) {
          flightToUpdate.isRejectedbyREB = true;
        }

        flightToUpdate.rejectedReason = prompt("Введіть причину заборони") ?? undefined;
        await this.flightService.updateFlightAsync(flightToUpdate);
      }
    }

    await this.getFlights();
  }

  async getFlights() {
    
    const allFlights = await this.flightService.getAllFlightsAsync();
    
    const filtered = allFlights.filter(x => x.flightStep.step !== FlightSteps.END && !x.isRejected);
    
    this.flights = [];
    this.flights.push(...filtered.filter(x => x.flightStep.isApproved === false))

    this.options.dronAppointment?.forEach(c => {
      this.flights.push(...filtered.filter(x => x.flightStep.isApproved === true && x.assignment?.name === c.name));
    });

  }

  public get FlightSteps() {
    return FlightSteps;
  }

  public get UserRoles() {
    return UserRole;
  }
}
