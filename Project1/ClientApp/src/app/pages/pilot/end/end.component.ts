import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-pilot-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class PilotEndComponent implements OnInit, OnDestroy {
  flight!: Flight;
  dateNow = Date.now();
  isNextStep = false;
  subs: Subscription[] = [];
  successWithoutComments = 'Успішно';
  customOptionSelector = 'Свій варіант';
  endOptions: string[] = [ this.successWithoutComments, 'Не успішно', 'Борт пошкоджено','Борт втрачено', this.customOptionSelector];

  custom = '';

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

  public validateStep() {
    return this.flight.boardingStatus == null || this.flight.boardingStatus == '' || (this.flight.boardingStatus != this.successWithoutComments && this.custom === '')
  }

  public async next() {
    if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
      alert('Не дозволено!');
      return;
    }

    this.flight.boardingStatusComments = this.custom;
    this.flight.endDate = new Date;
    this.flight.flightStep.step = FlightSteps.END;
    this.flight.flightStep.isApproved = true;
    this.flight.isRequireAttention = true;

    await this.flightService.updateFlightAsync(this.flight);
    await this.flightService.refreshActiveFlight();
  }
}