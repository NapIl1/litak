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
    selector: 'app-pilot-reduction',
    templateUrl: './reduction.component.html',
    styleUrls: ['./reduction.component.scss']
})
export class PilotReductionComponent implements OnInit, OnDestroy {
    flight!: Flight;
    dateNow = Date.now();
    isNextStep = false;
    subs: Subscription[] = [];
    reductions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

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

        this.flight.flightStep.step = FlightSteps.REDUCTION;
        this.flight.flightStep.isApproved = true;
    
        if (!isSkipped) {
          this.flight.reductionDate = new Date;
          this.flight.flightStep.visibleStep = FlightSteps.REDUCTION;
        }

        await this.flightService.updateFlightAsync(this.flight);
        await this.flightService.refreshActiveFlight();
    }

    public validateStep() {
        return this.flight.reductionDistance == null || this.flight.reductionLocation == null || this.flight.reductionLocation == ''
    }
}

