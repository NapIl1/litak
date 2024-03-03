import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FLIGHT_ROUTES } from 'src/app/consts/consts';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  userRoles = UserRole;

  userInfo: User = {};

  dateNow = Date.now();

  isNewFlight: boolean = true;

  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  flight!: Flight;

  isRequestOpened = false;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private optionsService: OptionsService,
    private userService: UserService,
    private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();

    const ui = this.userService.getUserInfo();

    if (ui) {
      this.userInfo = ui;

      await this.flightService.refreshActiveFlight();

      this.flightService.activeFlight$.subscribe(flight => {
        this.handleRouting(flight);

        if (flight) {
          this.flight = flight;
        } else {
          this.flight = {
            isRequireAttention: false,
            flightStep: {
              step: FlightSteps.START,
              isApproved: false,
              isApprovedByPPO: false,
              isApprovedByREB: false,
            },
            dateOfFlight: new Date()
          };
        }
      });
    }
  }

  private handleRouting(flight: Flight | null) {
    if (!flight) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.START]);
      return;
    }

    if (flight.flightStep.step === FlightSteps.START && flight.flightStep.isApproved === false) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.WAITING_APPROVAL]);
      return;
    }

    if (flight.flightStep.step === FlightSteps.START && flight.flightStep.isApproved === true) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.FLIGHT]);
    }

    if (flight.flightStep.step === FlightSteps.FLIGHT) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.LBZ_FORWARD]);
    }

    if (flight.flightStep.step === FlightSteps.LBZ_FORWARD) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.RETURN]);
    }

    if (flight.flightStep.step === FlightSteps.RETURN) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.LBZ_HOME]);
    }

    if (flight.flightStep.step === FlightSteps.LBZ_HOME) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.REDUCTION]);
    }

    if (flight.flightStep.step === FlightSteps.REDUCTION) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.END]);
    }

    if (flight.flightStep.step === FlightSteps.END) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.START]);
      this.isRequestOpened = false;
    }
  }

  public navigateToDiscordUrl() {
    window.open(this.options.discordUrl, '_blank')!.focus();
  }

  public async terminateFlight(isApproved: boolean) {
    this.flight.isTerminated = true;
    this.flight.endDate = new Date;
    this.flight.flightStep.step = FlightSteps.END;
    this.flight.flightStep.isApproved = isApproved;

    await this.flightService.updateFlightAsync(this.flight);
    this.router.navigate(['flight']);
  }

  public async getLastFlight(isApproved: boolean){
    this.flight.isTerminated = true;
    this.flight.endDate = new Date;
    this.flight.flightStep.step = FlightSteps.END;
    this.flight.flightStep.isApproved = isApproved;

    await this.flightService.updateFlightAsync(this.flight);
    
    this.flight.userId = this.userInfo._id;

    const flightRecord = await this.flightService.getLastFlightByUserId();

    if(flightRecord == null){
      alert('Останню заявку не знайдено.');
    }else{
      this.flight.operator = flightRecord.operator;
      this.flight.unit = flightRecord.unit;
      this.flight.zone = flightRecord.zone;
      this.flight.taskPerformanceArea = flightRecord.taskPerformanceArea;
      this.flight.assignment = flightRecord.assignment;
      this.flight.model = flightRecord.model;
      this.flight.controlRange = flightRecord.controlRange;
      this.flight.videoRange = flightRecord.videoRange;
      this.flight.routeForward = flightRecord.routeForward;
      this.flight.routeBack = flightRecord.routeBack;
      this.flight.workingHeight = flightRecord.workingHeight;
      this.flight.streamLink = flightRecord.streamLink;
      this.flight.phoneNumber = flightRecord.phoneNumber;
    }

    this.router.navigate(['flight']);
  }

  public validateStep(step: FlightSteps) {
    // TODO: refactor later

    switch (step) {
      case FlightSteps.START:
        return this.flight.isInDiscord !== true
          || this.flight.assignment == null
          || this.flight.model == null
          || this.flight.operator == null || this.flight.operator === ''

    }
    return false;
  }

  public navigateToRequest() {
    this.isRequestOpened = !this.isRequestOpened;
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
