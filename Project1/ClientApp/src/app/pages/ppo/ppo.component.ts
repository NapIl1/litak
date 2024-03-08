import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ValueColor } from 'src/app/models/droneModel';
import { Flight, FlightStep, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';

export interface CompletedFlight {
  flight: Flight,
  msElapsed: number
}


@Component({
  selector: 'app-ppo',
  templateUrl: './ppo.component.html',
  styleUrls: ['./ppo.component.scss']
})
export class PpoComponent implements OnInit, OnDestroy {

  flights: Flight[] = [];

  options: DroneOptions = {};
  userRole?: UserRole;
  refreshFlightSubscription?: Subscription;

  interval_ms = 30000;

  private readonly timeRangeMinutes = 5;
  endOptions: string[] = ['Завдання виконано', 'Борт пошкоджено', 'Борт втрачений'];

  flightStatuses: ValueColor[] = [];

  completedFlights: CompletedFlight[] = [];

  constructor(private flightService: FlightService,
              private optionsService: OptionsService,
              private userService: UserService) {

  }
  ngOnDestroy(): void {
    this.refreshFlightSubscription?.unsubscribe();
  }

  toggleSection(flight: Flight) {
    flight.isExpanded = !flight.isExpanded;

    const checkedFlights = this.getCheckedFlights();

    if(flight.isForwardChanged === true && !checkedFlights.checkedLBZForwardChange.includes(flight._id!)) {
      checkedFlights.checkedLBZForwardChange.push(flight._id!);
      flight.isChecked = true;
    }

    if(flight.isReturnChanged === true && !checkedFlights.checkedLBZBackChange.includes(flight._id!)) {
      checkedFlights.checkedLBZBackChange.push(flight._id!);
      flight.isChecked = true;
    }

    this.saveCheckedFlights(checkedFlights);
  }

  async ngOnInit(): Promise<void> {
    await this.getOptions();
    await this.initFlights();

    var ui = this.userService.getUserInfo();

    if (ui) {
      this.userRole = ui.role;
    }

    if (this.options.flightStatus) {
      this.flightStatuses = this.options.flightStatus;
    }

    this.refreshFlightSubscription = interval(this.interval_ms).subscribe(async x => {
      this.completedFlights.forEach(flight => {
        flight.msElapsed += this.interval_ms;
      })

      this.flights = this.flights.filter(x => !this.completedFlights.find(completed => completed.flight._id === x._id))
      this.completedFlights = this.completedFlights.filter(x => x.msElapsed < (this.interval_ms * 5));
      await this.initFlights();
    })
  }

  public async getOptions() {
    this.options = await this.optionsService.getAllOptions();
  }

  public async approve(flightId: string | undefined) {

    if (flightId) {
      //const flightToUpdate = this.flights.find(x => x._id == flightId);

      const flightToUpdate = await this.flightService.getByIdAsync(flightId);
      const checkedFlights = this.getCheckedFlights();

      if (flightToUpdate) {

        const oldFlight = this.flights.find(x => x._id == flightId);
        if (oldFlight) {
          oldFlight.flightStep.isApproved = true;
        }

        if (this.userRole == UserRole.PPO) {
          flightToUpdate.flightStep.isApprovedByPPO = true;
        }

        if (this.userRole == UserRole.REB) {
          flightToUpdate.flightStep.isApprovedByREB = true;
        }

        if (this.userRole == UserRole.ADMIN) {
          flightToUpdate.flightStep.isApprovedByAdmin = true;
        }

        checkedFlights.checkedIsApproved.push(flightId);
        this.saveCheckedFlights(checkedFlights);

        if (flightToUpdate.flightStep.isApprovedByPPO == true
           && flightToUpdate.flightStep.isApprovedByREB == true
           && flightToUpdate.flightStep.isApprovedByAdmin == true) {
          flightToUpdate.flightStep.isApproved = true;
          flightToUpdate.isRequireAttention = false;
        }

        

        const fl = this.flights.find(x => x._id === flightId);
        if(fl) {
          fl.isExpanded = false;
        }
      
        await this.flightService.updateFlightAsync(flightToUpdate);
        await this.initFlights();
      }
    }

    
  }

  public async discard(id: string | undefined) {
    if (id) {
      const flightToUpdate = this.flights.find(x => x._id == id);

      if (flightToUpdate) {
        flightToUpdate.isRejected = true;

        const oldFlight = this.flights.find(x => x._id == id);
        if(oldFlight) {
          oldFlight.isRejected = true;
        }

        if (this.userRole == UserRole.PPO) {
          flightToUpdate.isRejectedbyPPO = true;
        }

        if (this.userRole == UserRole.REB) {
          flightToUpdate.isRejectedbyREB = true;
        }

        if (this.userRole == UserRole.ADMIN) {
          flightToUpdate.isRejectedbyAdmin = true;
        }

        flightToUpdate.rejectedReason = prompt("Введіть причину заборони") ?? undefined;
        await this.flightService.updateFlightAsync(flightToUpdate);
      }
    }

    await this.initFlights();
  }

  async initFlights() {
    const nonCollapsedFlights = this.flights.filter(x => x.isExpanded === true);

    const allFlights = await this.flightService.getFlightsWithTimeRange(this.timeRangeMinutes);

    const filtered = allFlights.filter(x => !x.isRejected);
    
    const newFlights: Flight[] = [];

    newFlights.push(...filtered.filter(x => x.flightStep.isApproved === false))

    this.options.dronAppointment?.forEach(c => {
      newFlights.push(...filtered.filter(x => x.flightStep.isApproved === true && x.assignment?.name === c.name));
    });

    newFlights.forEach(flight => {
      if (flight.flightStep.step == FlightSteps.END) {
        flight.flightStep.visibleStep = FlightSteps.END;
        flight.assignment!.color = 'gray';
        if (!this.endOptions.includes(flight.boardingStatus ?? '')) {
          flight.boardingStatus = 'Інше';
        }
      }
    });

    newFlights.forEach(updatedFlight => {
      // Find the corresponding collapsed flight
      const nonCollapsedFlight = nonCollapsedFlights.find(flight => flight._id === updatedFlight._id);
      if (nonCollapsedFlight && nonCollapsedFlight.isExpanded !== updatedFlight.isExpanded) {
        updatedFlight.isExpanded = nonCollapsedFlight.isExpanded;
      }
    });

    // Checked flight

    const checkedFlights = this.getCheckedFlights();

    newFlights.forEach(flight => {
      flight.isChecked = checkedFlights.checkedIsApproved.includes(flight._id!);

      if (flight.isForwardChanged === true) {
        flight.isChecked = checkedFlights.checkedLBZForwardChange.includes(flight._id!);
      }


      if (flight.isReturnChanged === true) {
        flight.isChecked = checkedFlights.checkedLBZBackChange.includes(flight._id!);
      }

      if(flight.isChecked !== true || flight.isExpanded === true) {
        flight.isExpanded = true;
      }
    });
  
    const filteredChecks: CheckedFlights = {
      checkedIsApproved: checkedFlights.checkedIsApproved.filter(id => newFlights.some(x => x._id == id)),
      checkedLBZBackChange: checkedFlights.checkedLBZBackChange.filter(id => newFlights.some(x => x._id == id)),
      checkedLBZForwardChange: checkedFlights.checkedLBZForwardChange.filter(id => newFlights.some(x => x._id == id))
    };

    this.saveCheckedFlights(filteredChecks);

    // Insert filtered flights
    this.flights = [];
    this.flights = [...newFlights];
  }


  public getCheckedFlights(): CheckedFlights {
    const item = localStorage.getItem(this.CHECKED_FLIGHTS_KEY);

    const empty = {
      checkedIsApproved: [],
      checkedLBZBackChange: [],
      checkedLBZForwardChange: []
    }

    if(item != null) {
      const parsed: CheckedFlights = JSON.parse(item);
      return (parsed.checkedIsApproved && parsed.checkedLBZBackChange && parsed.checkedLBZForwardChange) ? parsed : empty;
    }

    return empty;
  }

  public saveCheckedFlights(checkedFlights: CheckedFlights) {
    localStorage.setItem(this.CHECKED_FLIGHTS_KEY, JSON.stringify(checkedFlights));
  }

  private readonly CHECKED_FLIGHTS_KEY = 'CHECKED_FLIGHTS';

  public get FlightSteps() {
    return FlightSteps;
  }

  public get UserRoles() {
    return UserRole;
  }
}

export interface CheckedFlights {
  checkedLBZForwardChange: string[],
  checkedLBZBackChange: string[],
  checkedIsApproved: string[]
}