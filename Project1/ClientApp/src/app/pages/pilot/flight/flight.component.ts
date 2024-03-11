import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FLIGHT_ROUTES } from 'src/app/consts/consts';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-pilot-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class PilotFlightComponent implements OnInit {
    flights: Flight[] = [];
    flight!: Flight;
    userInfo!: User;
    options!: DroneOptions;
    localRouterPath!: string;
    isNewFlight: boolean = true;
    dateNow = Date.now();

    constructor(
      private router: Router,
      private flightService: FlightService,
      private optionsService: OptionsService,
      private userService: UserService,
      private route: ActivatedRoute,
      private routingService: RoutingService) { }

    async ngOnInit(): Promise<void> {
      this.options = await this.optionsService.getAllOptions();

      const ui = this.userService.getUserInfo();
  
      if (ui) {
        this.userInfo = ui;
  
        this.flightService.activeFlight$.subscribe(flight => {
          if (flight) {
            this.flight = flight;
          }
        });
      }
      
    }
  
    public async next() {
      if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
        alert('Не дозволено!');
        return;
      }

      this.flight.flightStartDate = new Date;
      this.flight.flightStep.step = FlightSteps.FLIGHT;
      this.flight.flightStep.visibleStep = FlightSteps.FLIGHT;
      this.flight.flightStep.isApproved = true;
      this.flight.isRequireAttention = true;


  
      await this.flightService.updateFlightAsync(this.flight);
      await this.flightService.refreshActiveFlight();
    }
  
    public async terminateFlight(isApproved: boolean) {
      const res = confirm("Ви впевнені що хочете завершити політ?")
      if (res) {
        this.flight.isTerminated = true;
        this.flight.endDate = new Date;
        this.flight.flightStep.step = FlightSteps.END;
        this.flight.flightStep.visibleStep = FlightSteps.END;
        this.flight.flightStep.isApproved = isApproved;

        await this.flightService.updateFlightAsync(this.flight);
        await this.flightService.refreshActiveFlight();
      }
    }

  
    public get FlightSteps() {
      return FlightSteps;
    }
}