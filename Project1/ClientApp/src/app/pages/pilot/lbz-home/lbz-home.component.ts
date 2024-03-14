import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';

@Component({
    selector: 'app-pilot-lbz-home',
    templateUrl: './lbz-home.component.html',
    styleUrls: ['./lbz-home.component.scss']
})
export class PilotLbzHomeComponent implements OnInit, OnDestroy {
    flight!: Flight;
    dateNow = Date.now();
    isNextStep = false;
    isChangeRoute = false;
    subs: Subscription[] = [];

    constructor(
        private flightService: FlightService) { }

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

        if (isSkipped) {
            const res = confirm("Ви впевнені?");
      
            if (res === false) {
              return;
            }
        }

        if (this.isChangeRoute) {
            this.flight.isReturnChanged = true;
            this.flight.isRequireAttention = true;
        }

        this.flight.flightStep.step = FlightSteps.LBZ_HOME;
        this.flight.flightStep.isApproved = true;
    
        if (!isSkipped) {
          this.flight.LBZBackDate = new Date;
          this.flight.flightStep.visibleStep = FlightSteps.LBZ_HOME;
        }

        await this.flightService.updateFlightAsync(this.flight);
        await this.flightService.refreshActiveFlight();
    }

    public validateStep() {
        return this.flight.changedReturnRoute == null || this.flight.changedReturnRoute == ''
    }

    public get FlightSteps() {
        return FlightSteps;
    }

    changeRoute() {
        var res = confirm("Ви впевнені?");
    
        if(res === true) {
          this.isChangeRoute = true;
        }
      }
}