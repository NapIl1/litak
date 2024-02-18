import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pilot-lbz-forward',
  templateUrl: './lbz-forward.component.html',
  styleUrls: ['./lbz-forward.component.scss']
})
export class PilotLbzForwardComponent implements OnInit, OnDestroy {
  @Input() flights: Flight[] = [];
  @Input() flight!: Flight;
  @Input() userInfo!: User;
  @Input() options!: DroneOptions;
  isNewFlight: boolean = true;
  dateNow = Date.now();

  subs: Subscription[] = [];

  isChangeRoute = false;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private optionsService: OptionsService,
    private userService: UserService,
    private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  async ngOnInit(): Promise<void> {
    const s = this.flightService.activeFlight$.subscribe(flight => {
      if (flight) {
        this.flight = flight;
      }
    });

    this.subs.push(s);
  }

  public async next(isSkipped = false) {
    if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
      alert('Не дозволено!');
      return;
    }

    if (this.isChangeRoute) {
      this.flight.isForwardChanged = true;
    }

    
    this.flight.flightStep.step = FlightSteps.LBZ_FORWARD;
    this.flight.flightStep.isApproved = true;

    if (!isSkipped) {
      this.flight.LBZForwardDate = new Date;
      this.flight.flightStep.visibleStep = FlightSteps.LBZ_FORWARD;
    }
    
    this.flight.isSectionCollapsed = true;

    await this.flightService.updateFlightAsync(this.flight);
    await this.flightService.refreshActiveFlight();
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}