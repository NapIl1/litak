import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DroneOptions } from 'src/app/models/options';
import { User, Template } from 'src/app/models/user';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-flight-template',
  templateUrl: './flight-templates.component.html',
  styleUrls: ['./flight-templates.component.scss']
})
export class FlightTemplateComponent implements OnInit {
    template: Template = {
      templateName: '',

    };
    options: DroneOptions = {
        boardingStatuses: [],
        dronAppointment: [],
        dronModels: []
      };

    constructor(private userService: UserService,
         private optionsService: OptionsService,
         private router: Router) { }


    async ngOnInit(): Promise<void> {
        this.options = await this.optionsService.getAllOptions();
    }

    async createTemplate() {
      this.template.id = uuidv4();
      this.userService.addTemplate(this.template);

      alert(`Шаблон з іменем ${this.template.templateName} було успішно створено.`);

      this.router.navigate(["personal-info"]);

      this.template = {
        templateName: '',
      };
    }

    validateTemplate(){
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        return false;
    }
}