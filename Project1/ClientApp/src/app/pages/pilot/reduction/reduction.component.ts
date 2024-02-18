import { Component, Input, OnInit } from '@angular/core';
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
export class PilotReductionComponent implements OnInit {
    @Input() flights: Flight[] = [];
    @Input() flight!: Flight;
    @Input() userInfo!: User;
    @Input() options!: DroneOptions;
    isNewFlight: boolean = true;
    dateNow = Date.now();

    subs: Subscription[] = [];

    constructor(
        private router: Router,
        private flightService: FlightService,
        private optionsService: OptionsService,
        private userService: UserService,
        private route: ActivatedRoute) { }

    async ngOnInit(): Promise<void> {
        const s = this.flightService.activeFlight$.subscribe(flight => {
            if (flight) {
                this.flight = flight;
            }
        });

        this.subs.push(s);
    }

    public async createFlight() {
        this.flight.userId = this.userInfo._id;

        await this.flightService.addFlightAsync(this.flight);
        await this.getFlightsAssignedToUser();

        alert('Заявку подано');
    }

    public async next(isSkipped = false) {
        if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
            alert('Не дозволено!');
            return;
        }

        this.flight.reductionDate = new Date;
        this.flight.flightStep.step = FlightSteps.REDUCTION;
        this.flight.flightStep.isApproved = true;
        this.flight.isSectionCollapsed = true;

        if (!isSkipped) {
            this.flight.flightStep.visibleStep = FlightSteps.REDUCTION;
        }

        await this.flightService.updateFlightAsync(this.flight);
        await this.getFlightsAssignedToUser();

        if (this.flight.flightStep.step == FlightSteps.END) {
            this.router.navigate(['new-flight']);
            return;
        }
    }


    public async terminateFlight(isApproved: boolean) {
        this.flight.isTerminated = true;
        this.flight.endDate = new Date;
        this.flight.flightStep.step = FlightSteps.END;
        this.flight.flightStep.isApproved = isApproved;

        await this.getFlightsAssignedToUser();
        await this.flightService.updateFlightAsync(this.flight);
        this.router.navigate(['new-flight']);
    }

    private async getFlightsAssignedToUser() {
        this.flights = await this.flightService.getByUserIdAsync(this.userInfo._id);
    }

    public get FlightSteps() {
        return FlightSteps;
    }
}

