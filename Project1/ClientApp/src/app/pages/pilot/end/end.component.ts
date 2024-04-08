import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';
import { ToastsService } from 'src/app/services/toasts.service';

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
  endOptions: string[] = ['ЗЕМЛЯ', 'ВТРАЧЕНО'];
  flightId?: string|undefined;
  custom = '';

	private toastService = inject(ToastsService);

  constructor(
    private flightService: FlightService) { }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  async ngOnInit(): Promise<void> {
    const s = this.flightService.activeFlight$.subscribe(flight => {
      if (flight) {
        this.flight = flight;
        this.flightId = this.flight._id;
      }
    });

    this.subs.push(s);
  }

  public validateStep() {
    return this.flight.boardingStatus == null || this.flight.boardingStatus == '';
  }

  public async next() {
    if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
      // alert('Не дозволено!');
      this.toastService.showError('Не дозволено!');
      return;
    }

    this.flight.endDate = new Date();
    this.flight.flightStep.step = FlightSteps.END;
    this.flight.flightStep.isApproved = true;
    this.flight.isRequireAttention = true;

    try {
      await this.flightService.updateFlightAsync(this.flight);
      await this.flightService.refreshActiveFlight();
    } catch (error) {
      this.flight._id = this.flightId;
      this.flight.endDate = undefined;
      this.flight.flightStep.step = FlightSteps.REDUCTION;
    }
  }
}