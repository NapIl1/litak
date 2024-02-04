import { Component } from '@angular/core';
import { DroneOptions } from 'src/app/models/options';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  name: string = '';
  color: string = '';

  avaliableColors: string[] = [
    'rgb(89, 105, 255)',
    'rgb(255, 64, 123)'
  ]

  colorPlaceholder = 'Текст';

  constructor(private optionsService: OptionsService) {

  }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();

  }

  public async addNewOption(type: string) {
    await this.optionsService.addOption(this.name, this.color, type);
    this.options = await this.optionsService.getAllOptions();

  }

  public async removeOption(index:number, type: string) {

    await this.optionsService.removeOption(index, type);
    this.options = await this.optionsService.getAllOptions();
    
  }
}
