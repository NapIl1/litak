import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { DroneModel, ValueColor } from 'src/app/models/droneModel';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {

  dateFlight = Date.now();

  flight: Flight = {
    id: '87f35444-ab91-4339-9ec1-7848630d05c6',
    flightStep: {
      step: FlightSteps.START,
      isApproved: true,
    },
    dateOfFlight: new Date()
  };

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {

    

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (!id) {
        return;
      }

      const flight = this.flightService.getById(id);

      if (!flight) {
        return;
      }

      this.flight = flight;

      this.flight.assignment = this.droneAssignments.find(x => x.name == this.flight.assignment?.name);
      this.flight.model = this.droneModels.find(x => x.name == this.flight.model?.name);
      
    })



    

    

  }

  public next() {
    console.log(this.flight);

    if(FlightSteps.END < FlightSteps.FLIGHT)

    this.flight.dateOfFlight = new Date(Date.now());

    // this.flightService.addFlight(this.flight);
  }

  public get FlightSteps () {
    return FlightSteps;
  }


  droneModels: DroneModel[] = [
    {
      name: 'Мавік 3Т',
      color: '#5969ff'
    },
    {
      name: 'Інший',
      color: '#ffb739'
    }
  ]

  droneAssignments: ValueColor[] = [
    {
      name: 'Ударний байрактар',
      color: '#5969ff'
    },
    {
      name: 'Інший',
      color: '#ffb739'
    }
  ]

  returnTypes = [
    {
      name: 'Тип повернення',
      color: '#5969ff'
    },
    {
      name: 'Інший',
      color: '#ffb739'
    }
  ]

  langingTypes = [
    {
      name: 'Посадка',
      color: '#5969ff'
    },
    {
      name: 'Інший',
      color: '#ffb739'
    }
  ]

}
