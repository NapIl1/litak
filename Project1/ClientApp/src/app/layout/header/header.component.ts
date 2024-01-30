import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  userRoles = UserRole;

  userInfo: User = {};

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
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
