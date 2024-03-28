import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FLIGHT_ROUTES } from 'src/app/consts/consts';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from 'src/app/services/toasts.service';
import { PromptModalComponent } from '../../shared/prompt-modal/prompt-modal.component';

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

    private toastService = inject(ToastsService);

    constructor(
      private router: Router,
      private flightService: FlightService,
      private optionsService: OptionsService,
      private userService: UserService,
      private route: ActivatedRoute,
      private routingService: RoutingService,
      private modalService: NgbModal) { }

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
        // alert('Не дозволено!');
        this.toastService.showError('Не дозволено!');
        return;
      }

      const modal = this.modalService.open(YesNoModalComponent);
      modal.componentInstance.text = 'Ви впевнені?';
      modal.componentInstance.yes = 'Так';
      modal.componentInstance.no = 'Ні';

      modal.closed.subscribe(async res => {
        if (res == true) {
          this.flight.flightStartDate = new Date;
          this.flight.flightStep.step = FlightSteps.FLIGHT;
          this.flight.flightStep.visibleStep = FlightSteps.FLIGHT;
          this.flight.flightStep.isApproved = true;
          this.flight.isRequireAttention = true;

          await this.flightService.updateFlightAsync(this.flight);
          await this.flightService.refreshActiveFlight();
        }
      });
    }
  
    public async terminateFlight(isApproved: boolean) {

      const modal = this.modalService.open(PromptModalComponent);
      modal.componentInstance.text = 'Введіть причину скасування.';
      modal.componentInstance.yes = 'Ок';
      modal.componentInstance.no = 'Назад';

      modal.closed.subscribe(async res => {
        if (res !== null) {
          this.flight.isTerminated = true;
          this.flight.terminatedPilotReason = res;
          this.flight.endDate = new Date;
          this.flight.flightStep.step = FlightSteps.END;
          this.flight.flightStep.visibleStep = FlightSteps.END;
          this.flight.flightStep.isApproved = isApproved;

          await this.flightService.updateFlightAsync(this.flight);
          await this.flightService.refreshActiveFlight();
        }
      });
    }

  
    public get FlightSteps() {
      return FlightSteps;
    }
}