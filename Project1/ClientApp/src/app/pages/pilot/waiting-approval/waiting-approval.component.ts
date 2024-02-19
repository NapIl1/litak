import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval, switchMap } from 'rxjs';
import { ValueColor } from 'src/app/models/droneModel';
import { Flight } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pilot-waiting-approval',
  templateUrl: './waiting-approval.component.html',
  styleUrls: ['./waiting-approval.component.scss']
})
export class WaitingApprovalComponent implements OnInit, OnDestroy {
  userRole?: UserRole;

  userInfo: User = {};

  flightStatuses: ValueColor[] = [];
  isNewFlight: boolean = true;

  flights: Flight[] = [];
  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  interval_ms = 10000;
  refreshFlightSubscription?: Subscription;
  constructor(
    private router: Router,
    private flightService: FlightService,
    private optionsService: OptionsService,
    private userService: UserService,
    private routingService: RoutingService) { }

  ngOnDestroy(): void {
    this.refreshFlightSubscription?.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();

    const ui = this.userService.getUserInfo();
    if (ui) {
      this.userRole = ui.role;
    }

    if (ui) {
      this.userInfo = ui;
    }

    if (this.options.flightStatus) {
      this.flightStatuses = this.options.flightStatus;
    }

    await this.initFlights();

    this.refreshFlightSubscription = interval(this.interval_ms).subscribe(async x => {
      await this.initFlights();
    })
  }

  async initFlights() {
    
    const allFlights = await this.flightService.getByUserIdAsync(this.userInfo._id);
    const filtered = allFlights.filter(x => !x.isRejected);
    
    this.flights = [];
    this.flights.push(...filtered.filter(x => x.flightStep.isApproved === false))

    this.options.dronAppointment?.forEach(c => {
      this.flights.push(...filtered.filter(x => x.flightStep.isApproved === true && x.assignment?.name === c.name));
    });

    if(allFlights[0].flightStep.isApprovedByPPO == true && allFlights[0].flightStep.isApprovedByREB == true){
      await this.flightService.refreshActiveFlight();
    }
  }

  public get UserRoles() {
    return UserRole;
  }
}
