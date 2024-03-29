import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() isAdminPage = false;

  userRoles = UserRole;

  userInfo: User = {};

  constructor(private flightService: FlightService, private userService: UserService, private router: Router) { }

  async ngOnInit(): Promise<void> {

    const ui = this.userService.getUserInfo();

    if(ui) {
      this.userInfo = ui;
    }
    
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

}
