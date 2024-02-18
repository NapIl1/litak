import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ValueColor } from 'src/app/models/droneModel';
import { Flight, FlightStep, FlightSteps } from 'src/app/models/flight';
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

  interval_ms = 10000;

  flightStatuses: ValueColor[] = [];

  constructor(private flightService: FlightService,
              private optionsService: OptionsService,
              private userService: UserService) {

  }
  ngOnDestroy(): void {
    this.refreshFlightSubscription?.unsubscribe();
  }

  toggleSection(flight: any) {
    flight.isSectionCollapsed = !flight.isSectionCollapsed;


    if(flight.isSectionCollapsed === false) {
      const str = localStorage.getItem("CHECKED_FLIGHTS");

      let checkedFlights: string[] = [];
  
      if(str != null) {
        checkedFlights = JSON.parse(str);
      } 

      if (!checkedFlights?.includes(flight._id)) {
        checkedFlights.push(flight._id);
        flight.isChecked = true;
        localStorage.setItem("CHECKED_FLIGHTS", JSON.stringify(checkedFlights));
      }

    }

   

    // save checked
  }

  async ngOnInit(): Promise<void> {

    var ui = this.userService.getUserInfo();

    if (ui) {
      this.userRole = ui.role;
    }

    await this.getOptions()
    await this.initFlights();

    if (this.options.flightStatus) {
      this.flightStatuses = this.options.flightStatus;
    }

    this.refreshFlightSubscription = interval(this.interval_ms).subscribe(async x => {
      await this.initFlights();
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
          flightToUpdate.isSectionCollapsed = true;
        }

        await this.flightService.updateFlightAsync(flightToUpdate);
      }
    }

    await this.initFlights();
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

    await this.initFlights();
  }

  async initFlights() {
    
    const nonCollapsedFlights = this.flights.filter(x=>x.isSectionCollapsed == false);
    const allFlights = await this.flightService.getActiveFlightAsync();
    
    const filtered = allFlights.filter(x => !x.isRejected);
    
    //console.log(filtered);

    this.flights = [];
    this.flights.push(...filtered.filter(x => x.flightStep.isApproved === false))

    this.options.dronAppointment?.forEach(c => {
      this.flights.push(...filtered.filter(x => x.flightStep.isApproved === true && x.assignment?.name === c.name));
    });

    this.flights.forEach(updatedFlight => {
      // Find the corresponding collapsed flight
      const nonCollapsedFlight = nonCollapsedFlights.find(flight => flight._id === updatedFlight._id);
      if (nonCollapsedFlight && nonCollapsedFlight.isSectionCollapsed !== updatedFlight.isSectionCollapsed) {
        updatedFlight.isSectionCollapsed = nonCollapsedFlight.isSectionCollapsed;
      }
    });

    const str = localStorage.getItem("CHECKED_FLIGHTS");

    let checkedFlights: string[] = [];

    if(str != null) {
      checkedFlights = JSON.parse(str);
    } 
    
    //[];

    this.flights.forEach(flight => {

      if (flight.isForwardChanged) {

        if (checkedFlights?.includes(flight._id!)) {
          flight.isChecked = true;
        } else {
          flight.isChecked = false;
        }
      } 
      else {
        flight.isChecked = true;
      }
    });
  
    checkedFlights = checkedFlights.filter(id => this.flights.some(x => x._id == id));

    localStorage.setItem("CHECKED_FLIGHTS", JSON.stringify(checkedFlights));

  }

  public get FlightSteps() {
    return FlightSteps;
  }

  public get UserRoles() {
    return UserRole;
  }
}