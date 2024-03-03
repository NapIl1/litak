import { Injectable } from '@angular/core';
import { Flight, FlightSteps } from '../models/flight';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, lastValueFrom } from 'rxjs';
import { API_URL } from '../consts/consts';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly RECORDS_URL = API_URL + 'Records';

  private activeFlightSubject = new BehaviorSubject<Flight | null>(null);
  public activeFlight$ = this.activeFlightSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {
  }

  public async getByIdAsync(id: string): Promise<Flight | undefined> {
    var flights = await lastValueFrom(this.http.get<Flight[]>(this.RECORDS_URL + `/GetRecordById?recordId=${id}`));
    return flights[0];
  }
    
  public async getByUserIdAsync(userId?: string): Promise<Flight[]> {
    const flights = await lastValueFrom(this.http.get<Flight[]>(this.RECORDS_URL + `/GetRecordsForUser?userId=${userId}`));
    return flights ?? [];
  }

  public async getActiveFlightAsync(): Promise<Flight[]> {
    const flights = await lastValueFrom(this.http.get<Flight[]>(this.RECORDS_URL + '/GetNotFinishedRecords'));
    return flights ?? [];
  }

  public async refreshActiveFlight() {
    const id = this.userService.getUserInfo()?._id;

    if (!id) {
      return;
    }

    const flights = await this.getByUserIdAsync(id);
    if (flights.length > 0) {
      this.activeFlightSubject.next(flights[0]);
    } else{
      this.activeFlightSubject.next(null);
    }
  }

  public async getLastFlightByUserId(): Promise<Flight | null> {
    const id = this.userService.getUserInfo()?._id;

    if (!id) {
      return null;
    }

    const flightRecord = await lastValueFrom(this.http.get<Flight>(this.RECORDS_URL + `/GetLastRecordByUserId?userId=${id}`));

    if(flightRecord == null){
      return null;
    }else{
      return flightRecord;
    }
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
    const flight = await this.getByIdAsync(id);


    if (!flight) {
      throw 'Doesnt exist';
    }
    flight.flightStep.isApproved = true;

    this.http.put(`${this.RECORDS_URL}?id=${flight._id}`, flight);

  }
}
