import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';

@Component({
    selector: 'app-pilot-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss']
})
export class PilotStartComponent implements OnInit {
  @Input() flights!: Flight[];
  @Input() flight!: Flight;
  @Input() userInfo!: User;
  @Input() options!: DroneOptions;
  

  dateNow = Date.now();
  isNewFlight: boolean = true;


  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
      this.flight.operatorPhone = this.userInfo.userOptions?.operatorPhoneNumber;
      this.flight.spotterPhone = this.userInfo.userOptions?.spotterPhoneNumber;
      this.flight.operator = this.userInfo.userOptions?.nickName;
      this.flight.discordUrl = this.options.discordUrl;
      this.flight.assignment = this.options.dronAppointment?.find(x => x.name.toUpperCase() == this.userInfo.userOptions?.dronAppointment?.toUpperCase());
      this.flight.model = this.options.dronModels?.find(x => x.name.toUpperCase() == this.userInfo.userOptions?.dronModel?.toUpperCase());

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');

      if (!id) {
        return;
      }

      this.isNewFlight = false;

      const flight = await this.flightService.getByIdAsync(id);

      if (!flight) {
        return;
      }

      this.flight = flight;

      this.flight.assignment = this.options?.dronAppointment?.find(x => x.name == this.flight.assignment?.name);
      this.flight.model = this.options.dronModels?.find(x => x.name == this.flight.model?.name);

    })

  }

  public navigateToDiscordUrl() {
    window.open(this.options.discordUrl, '_blank')!.focus();
  }

  public async createFlight() {
    this.flight.userId = this.userInfo._id;

    await this.flightService.addFlightAsync(this.flight);
    await this.getFlightsAssignedToUser();

    alert('Заявку подано');
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

  private async getFlightsAssignedToUser() {
    this.flights = await this.flightService.getByUserIdAsync(this.userInfo._id);
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
