import { Injectable, EventEmitter, Output } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import {Flight} from "../models/flight";
import {API_URL} from "../consts/consts";

@Injectable({
  providedIn: 'root'
})

export class FlightSignalRService {
  @Output() public recordAdded = new EventEmitter<Flight>();
  @Output() public recordUpdated = new EventEmitter<Flight>();
  private readonly RECORDS_HUB_URL = API_URL + 'recordsNotification';
  private hubConnection: signalR.HubConnection;

  public startConnection(){
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.RECORDS_HUB_URL)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addedNewBookListener() {
    this.hubConnection.on('recordAdded', (data) => {
      this.recordAdded.emit(data);
    })
  };

  public updatedBookListener() {
    this.hubConnection.on('recordUpdated', (data) => {
      this.recordUpdated.emit(data);
    })
  };
}
