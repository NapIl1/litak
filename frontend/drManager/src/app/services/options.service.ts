import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../consts/consts';
import { DroneOptions } from '../models/options';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  private readonly OPTIONS_API = API_URL + 'Options';

  constructor(public http: HttpClient) { }

  public async getAllOptions(): Promise<DroneOptions> {
    const options = await lastValueFrom(this.http.get<DroneOptions[]>(this.OPTIONS_API))
    return options[0] ?? {};
  }

  public async addOption(name: string, color: string, type: string) {

    const options = await this.getAllOptions();
    const optionId = options._id;

    if (type === 'boardingStatus') {
      options.boardingStatuses?.push({
        color: color,
        name: name
      });
    }

    if (type === 'dronAppointment') {
      options.dronAppointment?.push({
        color: color,
        name: name
      });
    }

    if (type === 'dronModel') {
      options.dronModels?.push({
        color: color,
        name: name
      });
    }
    
    delete options._id;
    
    await lastValueFrom(this.http.put(`${this.OPTIONS_API}?optionsId=${optionId}`,options));

  }

  public async removeOption(index: number, type: string) {
    const options = await this.getAllOptions();
    const optionId = options._id;

    if (type === 'boardingStatus') {
      options.boardingStatuses?.splice(index, 1);
    }

    if (type === 'dronAppointment') {
      options.dronAppointment?.splice(index, 1);
    }

    if (type === 'dronModel') {
      options.dronModels?.splice(index, 1);
    }

    delete options._id;
    
    await lastValueFrom(this.http.put(`${this.OPTIONS_API}?optionsId=${optionId}`,options));

  }

  // const mapp: DroneOptions = {
  //   "boardingStatuses": [
  //     {
  //       "name": "Цілий",
  //       "color": ""
  //     },
  //     {
  //       "name": "Пошкоджений",
  //       "color": ""
  //     },
  //     {
  //       "name": "Втрата",
  //       "color": ""
  //     }
  //   ],
  //   "dronAppointment": [
  //     {
  //       "name": "РОЗВІДУВАЛЬНИЙ",
  //       "color": ""
  //     },
  //     {
  //       "name": "УДАРНИЙ",
  //       "color": ""
  //     },
  //     {
  //       "name": "МАВІКИ",
  //       "color": ""
  //     }
  //   ],
  //   "dronModels": [
  //     {
  //       "name": "ЛЕЛЕКА",
  //       "color": ""
  //     },
  //     {
  //       "name": "МАВІК 3Т",
  //       "color": ""
  //     },
  //     {
  //       "name": "ФУРІЯ",
  //       "color": ""
  //     },
  //     {
  //       "name": "ШАРК",
  //       "color": ""
  //     },
  //     {
  //       "name": "МАВІК",
  //       "color": ""
  //     },
  //     {
  //       "name": "ВАЛЬКІРІЯ",
  //       "color": ""
  //     }
  //   ]
  // }

}
