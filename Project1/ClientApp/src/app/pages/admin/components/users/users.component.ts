import { Component, OnInit } from '@angular/core';
import { User, UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  UserRoles = UserRole;

  users: User[] = [];

  login: string = '';
  password: string = '';
  role?: UserRole = UserRole.NOT_SELECTED;

  constructor(private userService: UserService) {}


  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getAllUsers();
  }

  async removeUser(id: string | undefined) {
    if(!id) return;

    await this.userService.removeUser(id);
    alert('Користувач був видалений');

    this.users = await this.userService.getAllUsers();
  }

  async addNewUser() {
    const res = await this.userService.addUser({
      login: this.login,
      password: this.password,
      role: this.role
    })

    this.users = await this.userService.getAllUsers();
  }

}
