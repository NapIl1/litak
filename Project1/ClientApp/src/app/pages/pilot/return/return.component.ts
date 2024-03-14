import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';

@Component({
    selector: 'app-pilot-return',
    templateUrl: './return.component.html',
    styleUrls: ['./return.component.scss']
})
export class PilotReturnComponent implements OnInit, OnDestroy {
    flight!: Flight;
    dateNow = Date.now();
    isNextStep = false;
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

        this.flight.flightStep.step = FlightSteps.RETURN;
        this.flight.flightStep.isApproved = true;
    
        if (!isSkipped) {
          this.flight.returnDate = new Date;
          this.flight.flightStep.visibleStep = FlightSteps.RETURN;
        }

        await this.flightService.updateFlightAsync(this.flight);
        await this.flightService.refreshActiveFlight();
    }



    public get FlightSteps() {
        return FlightSteps;
    }
}