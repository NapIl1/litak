import { Component, Input, OnInit } from '@angular/core';
import { ValueColor } from 'src/app/models/droneModel';
import { Flight } from 'src/app/models/flight';
import { UserRole } from 'src/app/models/user';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent implements OnInit {

  @Input() isCollapsable = false;

  @Input() flight!: Flight;

  userRole?: UserRole;

  flightStatuses: ValueColor[] = [];

  constructor(private userService: UserService,
              private optionsService: OptionsService) {

  }


  async ngOnInit(): Promise<void> {
    var ui = this.userService.getUserInfo();
    if (ui) {
      this.userRole = ui.role;
    }
    
    const options = await this.optionsService.getAllOptions();

    if (options.flightStatus) {
      this.flightStatuses = options.flightStatus;
    }
  }

  toggleSection(flight: any) {
    if(this.isCollapsable) {
      flight.isRequireAttention = !flight.isRequireAttention;
    }
  }

  public get UserRoles() {
    return UserRole;
  }

  public async approve(id: string | undefined) {

  }

  public async discard(id: string | undefined) {

  }
}
