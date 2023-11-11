import { Injectable } from '@angular/core';
import { Flight, FlightSteps } from '../models/flight';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { API_URL } from '../consts/consts';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly RECORDS_URL = API_URL + 'Records';

  constructor(private http: HttpClient) {
  }

  public async getById(id: string): Promise<Flight | undefined> {

    const flights = await this.getAllFlightsAsync();
    console.log(flights);
    const flight = flights?.find(x => x._id === id);

    return flight;
  }

  public async getAllFlightsAsync(): Promise<Flight[]> {
    const flights = await lastValueFrom(this.http.get<Flight[]>(this.RECORDS_URL));

    return flights ?? [];
  }

  public async addFlightAsync(flight: Flight): Promise<void> {
    try {
      await lastValueFrom(this.http.post(this.RECORDS_URL, flight));
    } catch (error) {
      
    }
  }

  public async updateFlightAsync(flight: Flight): Promise<void> {
    try {
      const id = flight._id;
      delete flight._id;

      await lastValueFrom(this.http.put(this.RECORDS_URL + `?recordId=${id}`, flight));

      flight._id = id;
    } catch (error) {
      
    }

  }

  public async removeFlight(id: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete(this.RECORDS_URL + `?recordId=${id}`));
    } catch (error) {

    }
  }

  public async approveAsync(id: string): Promise<void> {
    const flights = await this.getAllFlightsAsync();

    const flight = flights.find(x => x._id === id);

    if (!flight) {
      throw 'Doesnt exist';
    }
    flight.flightStep.isApproved = true;

    this.http.put(`${this.RECORDS_URL}?id=${flight._id}`, flight);

  }
}
