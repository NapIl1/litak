import { Injectable } from '@angular/core';
import { Flight, FlightSteps } from '../models/flight';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private static readonly KEY = 'FL';

  constructor() {

    const fl = localStorage.getItem(FlightService.KEY);

    if (!fl) {
      const mocked = this.getMockedFlights();
      localStorage.setItem(FlightService.KEY, JSON.stringify(mocked));
    }

  }

  public getById(id: string): Flight | undefined {
    const flights = this.getAllFlights();

    const flight = flights.find(x => x.id === id);

    return flight;
  }

  public addFlight(flight: Flight): void {
    const fl = localStorage.getItem("FL");

    if (fl) {
      const flights = JSON.parse(fl);
      flights.push(flight);

      localStorage.setItem(FlightService.KEY, JSON.stringify(flights));
    }
  }

  public approve(id: string): void {

    const flights = this.getAllFlights();

    const flight = flights.find(x => x.id === id);

    if(flight) {
      flight.flightStep.isApproved = true;

      localStorage.setItem(FlightService.KEY, JSON.stringify(flights));
    }


  }

  public getAllFlights(): Flight[] {
    const fl = localStorage.getItem("FL");

    if (fl) {
      return JSON.parse(fl);
    }
    return []
  }



  private getMockedFlights(): Flight[] {
    return [
      {
        id: uuidv4(),
        operator: 'Vasyan',
        operatorPhone: '0676985522',
        spotterPhone: '0676985523',
        dateOfFlight: new Date(),
        routeForward: 'ROUTE FORWARD',
        routeBack: 'route back',
        assignment: {
          name: 'Ударний байрактар',
          color: '#5969ff'
        },
        model: {
          name: 'Мавік 3Т',
          color: '#5969ff'
        },
        flightStep: {
          isApproved: false,
          step: FlightSteps.START
        }
      },
      {
        id: uuidv4(),
        operator: 'Petro',
        operatorPhone: '0676985222',
        spotterPhone: '0676985333',
        dateOfFlight: new Date(),
        routeForward: 'ROUTE FORWARD22',
        routeBack: 'route back1123',
        assignment: {
          name: 'Ударний байрактар',
          color: '#5969ff'
        },
        model: {
          name: 'Мавік 3Т',
          color: '#5969ff'
        },
        flightStep: {
          isApproved: false,
          step: FlightSteps.START
        }
      },
    ]
  }

}
