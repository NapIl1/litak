import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { USE_PREVIOUS_PARAM } from 'src/app/consts/consts';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { Template, User, UserRole } from 'src/app/models/user';
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
    isRequireAttention: false,
    flightStep: {
      step: FlightSteps.START,
      visibleStep: FlightSteps.START,
      isApproved: false,
      isApprovedByAdmin: false,
      isApprovedByPPO: false,
      isApprovedByREB: false,
    },
    dateOfFlight: new Date()
  };

  selectedTemplate: Template| null = null;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private flightService: FlightService,
    private optionsService: OptionsService,
    private userService: UserService) { }

  public templateSelected() {
    

    if (this.selectedTemplate) {
      this.flight.assignment = this.options.dronAppointment?.find(x => x.name.toUpperCase() == this.selectedTemplate?.assignment?.name?.toUpperCase());
      this.flight.model = this.options.dronModels?.find(x => x.name.toUpperCase() == this.selectedTemplate?.model?.name?.toUpperCase());
      this.flight.controlRange = this.selectedTemplate.controlRange;
      this.flight.videoRange = this.selectedTemplate.videoRange;
      this.flight.workingHeight = this.selectedTemplate.workingHeight;
    }
  }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();

    const ui = this.userService.getUserInfo();

    this.activatedRoute.params.subscribe(async params => {

      const isUsePrev = params[USE_PREVIOUS_PARAM] == 'prev';
      if (isUsePrev) {
        await this.getLastFlight();
      } else {
        if (ui) {
          this.userInfo = ui;
    
          this.flight.phoneNumber = ui.userOptions?.phoneNumber;
          this.flight.operator = ui.userOptions?.nickName;
          this.flight.discordUrl = this.options.discordUrl;
          this.flight.unit = ui.userOptions?.unit;
          this.flight.assignment = this.options.dronAppointment?.find(x => x.name.toUpperCase() == ui.userOptions?.dronAppointment?.toUpperCase());
          this.flight.model = this.options.dronModels?.find(x => x.name.toUpperCase() == ui.userOptions?.dronModel?.toUpperCase());
          this.flight.isRequireAttention = false;
        }
      }
    })

    
  }

  public navigateToDiscordUrl() {
    window.open(this.options.discordUrl, '_blank')!.focus();
  }

  public async createFlight() {
    this.flight.userId = this.userInfo._id;
    this.flight.dateOfFlight =  new Date();
    await this.flightService.addFlightAsync(this.flight);

    alert('Заявку подано');
    await this.flightService.refreshActiveFlight();
    //this.route.navigate(['flight/' + FLIGHT_ROUTES.WAITING_APPROVAL]);
  }

  public async getLastFlight(){
    this.flight.userId = this.userInfo._id;

    const flightRecord = await this.flightService.getLastFlightByUserId();

    if (flightRecord == null) {
      alert('Останню заявку не знайдено.');
    } else {

      this.flight.assignment = this.options.dronAppointment?.find(x => x.name.toUpperCase() == flightRecord.assignment?.name?.toUpperCase());
      this.flight.model = this.options.dronModels?.find(x => x.name.toUpperCase() == flightRecord.model?.name?.toUpperCase());
      
      this.flight.operator = flightRecord.operator;
      this.flight.unit = flightRecord.unit;
      this.flight.zone = flightRecord.zone;
      this.flight.taskPerformanceArea = flightRecord.taskPerformanceArea;
      this.flight.controlRange = flightRecord.controlRange;
      this.flight.videoRange = flightRecord.videoRange;
      this.flight.routeForward = flightRecord.routeForward;
      this.flight.routeBack = flightRecord.routeBack;
      this.flight.workingHeight = flightRecord.workingHeight;
      this.flight.streamLink = flightRecord.streamLink;
      this.flight.phoneNumber = flightRecord.phoneNumber;
    }
  }

  validateStep() {
    return this.flight.isInDiscord !== true
      || this.flight.assignment == null
      || this.flight.model == null
      || this.flight.operator == null || this.flight.operator === ''
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
