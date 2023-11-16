import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { concatWith, switchMap } from 'rxjs';
import { DroneModel, ValueColor } from 'src/app/models/droneModel';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {

  userInfo: User = {};

  dateNow = Date.now();

  isNewFlight: boolean = true;

  flights: Flight[] = [];
  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  flight: Flight = {
    flightStep: {
      step: FlightSteps.START,
      isApproved: false,
    },
    dateOfFlight: new Date()
  };

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

      await this.getFlightsAssignedToUser();

      this.flight.operatorPhone = ui.userOptions?.operatorPhoneNumber;
      this.flight.spotterPhone = ui.userOptions?.spotterPhoneNumber;
      this.flight.operator = ui.userOptions?.nickName;
      this.flight.discordUrl = ui.userOptions?.discordUrl;
      this.flight.assignment = this.options.dronAppointment?.find(x => x.name.toUpperCase() == ui.userOptions?.dronAppointment?.toUpperCase());
      this.flight.model = this.options.dronModels?.find(x => x.name.toUpperCase() == ui.userOptions?.dronModel?.toUpperCase());
    }

    console.log(this.flights);
    console.log(this.options);

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');

      if (!id) {
        return;
      }

      this.isNewFlight = false;

      const flight = await this.flightService.getById(id);

      if (!flight) {
        return;
      }

      this.flight = flight;

      console.log(this.flight);

      this.flight.assignment = this.options?.dronAppointment?.find(x => x.name == this.flight.assignment?.name);
      this.flight.model = this.options.dronModels?.find(x => x.name == this.flight.model?.name);

    })

  }

  public async createFlight() {
    this.flight.userId = this.userInfo._id;

    console.log(this.flight);

    await this.flightService.addFlightAsync(this.flight);
    await this.getFlightsAssignedToUser();

    alert('Заявку подано');
  }

  public async next() {
    if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
      alert('Не дозволено!');
      return;
    }

    switch (this.flight.flightStep.step) {
      case FlightSteps.START:
        this.flight.flightStartDate = new Date;
        this.flight.flightStep = {
          step: FlightSteps.FLIGHT,
          isApproved: true
        };
        break;
      case FlightSteps.FLIGHT:
        this.flight.LBZForwardDate = new Date;
        this.flight.flightStep = {
          step: FlightSteps.LBZ_FORWARD,
          isApproved: true
        };
        break;
      case FlightSteps.LBZ_FORWARD:
        this.flight.returnDate = new Date;
        this.flight.flightStep = {
          step: FlightSteps.RETURN,
          isApproved: true
        };
        break;
      case FlightSteps.RETURN:
        this.flight.LBZBackDate = new Date;
        this.flight.flightStep = {
          step: FlightSteps.LBZ_HOME,
          isApproved: true
        };
        break;
      case FlightSteps.LBZ_HOME:
        this.flight.endDate = new Date;
        this.flight.flightStep = {
          step: FlightSteps.END,
          isApproved: true
        };
        break;
      case FlightSteps.END:
        break;

      default:
        break;
    }

    await this.flightService.updateFlightAsync(this.flight);
    await this.getFlightsAssignedToUser();

    if (this.flight.flightStep.step == FlightSteps.END) {
      this.router.navigate(['new-flight']);
      return;
    }

    // alert('Заявку подано');
  }

  public newFlight() {
    this.router.navigate(['new-flight']);
  }

  public async terminateFlight() {
    this.flight.isTerminated = true;
    this.flight.endDate = new Date;
    this.flight.flightStep = {
      step: FlightSteps.END,
      isApproved: true
    };

    await this.getFlightsAssignedToUser();
    await this.flightService.updateFlightAsync(this.flight);
    this.router.navigate(['new-flight']);
  }

  private async getFlightsAssignedToUser() {
    const allFligths = await this.flightService.getAllFlightsAsync();
      this.flights = allFligths.filter(x => x.userId == this.userInfo._id && x.flightStep.step != FlightSteps.END);
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
