import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

    constructor(
        private router: Router,
        private flightService: FlightService,
        private optionsService: OptionsService,
        private userService: UserService,
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

    public async next() {
        if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
            alert('Не дозволено!');
            return;
        }

        this.flight.reductionDate = new Date;
        this.flight.flightStep.step = FlightSteps.REDUCTION;
        this.flight.flightStep.isApproved = true;
        this.flight.isSectionCollapsed = true;

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

