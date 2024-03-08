import { Component, OnInit } from '@angular/core';
import * as saveAs from 'file-saver';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flights-stats',
  templateUrl: './flights-stats.component.html',
  styleUrls: ['./flights-stats.component.scss']
})
export class FlightsStatsComponent implements OnInit {

  flights: Flight[] = [];

  firstPart: Flight[] = [];
  secondPart: Flight[] = [];

  isExpanded = false;
  expanded: Flight | null = null;

  FlightSteps = FlightSteps;

  constructor(private flightService: FlightService) { }

  async ngOnInit(): Promise<void> {
    await this.getAllFlights();
  }

  async removeFlight(id: string | undefined) {
    if (id) {
      await this.flightService.removeFlight(id);
      await this.getAllFlights();
    }
  }

  async getAllFlights() {
    this.flights = (await this.flightService.getAllFlightsAsync())
      .sort((a, b) => new Date(b.dateOfFlight ?? '').getTime() - new Date(a.dateOfFlight ?? '').getTime());

    this.firstPart = [...this.flights];

  }

  expand(i: number) {
    if (this.expanded) {
      this.expanded = null;
      this.firstPart = [...this.flights];
      this.secondPart = [];

      return;
    }

    this.expanded = this.flights[i];
    this.firstPart = [...this.flights];
    this.secondPart = [...this.firstPart.splice(i + 1)];
  }

  isLoading = false;
  downloadFile(): void {
    this.isLoading = true;
    this.flightService.downloadFile().subscribe(res => {
      var filename = res.headers.get('Content-Disposition')!.split(';')[1].split('filename')[1].split('=')[1].trim();
      saveAs(res.body as Blob, filename);

      this.isLoading = false;
    });
  }

}
