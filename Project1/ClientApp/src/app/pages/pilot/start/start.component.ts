import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FLIGHT_ROUTES } from 'src/app/consts/consts';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-pilot-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss']
})
export class PilotStartComponent implements OnInit {
  userRoles = UserRole;

  userInfo: User = {};

  dateNow = Date.now();

  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  flight: Flight = {
    isSectionCollapsed: false,
    flightStep: {
      step: FlightSteps.START,
      visibleStep: FlightSteps.START,
      isApproved: false,
      isApprovedByPPO: false,
      isApprovedByREB: false,
    },
    dateOfFlight: new Date()
  };
  constructor(
    private route: Router,
    private flightService: FlightService,
    private optionsService: OptionsService,
    private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();

    const ui = this.userService.getUserInfo();

    if (ui) {
      this.userInfo = ui;

      this.flight.operatorPhone = ui.userOptions?.operatorPhoneNumber;
      this.flight.spotterPhone = ui.userOptions?.spotterPhoneNumber;
      this.flight.operator = ui.userOptions?.nickName;
      this.flight.discordUrl = this.options.discordUrl;
      this.flight.brigade = ui.userOptions?.brigade;
      this.flight.staffUnit = ui.userOptions?.staffUnit;
      this.flight.assignment = this.options.dronAppointment?.find(x => x.name.toUpperCase() == ui.userOptions?.dronAppointment?.toUpperCase());
      this.flight.model = this.options.dronModels?.find(x => x.name.toUpperCase() == ui.userOptions?.dronModel?.toUpperCase());
    }

    // this.flightService.activeFlight$.subscribe(res => {
    //   if(res) {

    //   }
    // })

  }

  public navigateToDiscordUrl() {
    window.open(this.options.discordUrl, '_blank')!.focus();
  }

  public async createFlight() {
    this.flight.userId = this.userInfo._id;

    await this.flightService.addFlightAsync(this.flight);

    alert('Заявку подано');
    await this.flightService.refreshActiveFlight();
    //this.route.navigate(['flight/' + FLIGHT_ROUTES.WAITING_APPROVAL]);
  }

  validateStep(step: FlightSteps) {
    // console.log("test");
    // TODO: refactor later

    switch(step) {
      case FlightSteps.START:
        return this.flight.isInDiscord !== true
        || this.flight.assignment == null
        || this.flight.model == null
        || this.flight.operator == null || this.flight.operator === ''

    }
    return false;
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
