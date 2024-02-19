import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  userInfo: User = {
    userOptions: {
      nickName: '',
      phoneNumber: '',
      unitNumber: '',
      dronType: '',
      dronModel: '',
      dronAppointment: '',
      unit: '',
    }
  };

  oldPassword = '';
  newPassword = '';

  constructor(private userService: UserService) { }


  ngOnInit(): void {
    var ui = this.userService.getUserInfo();
    if (ui) {
      this.userInfo = ui;
      if(!this.userInfo.userOptions) {
        this.userInfo.userOptions = {}
      }
    }
  }

  async saveChanges() {

    await this.userService.updateUser(this.userInfo);

    var ui = this.userService.getUserInfo();

    if (ui) {
      this.userInfo = ui;
    }
  }

  async changePassword() {

    if (this.oldPassword === this.userInfo.password) {
      this.userInfo.password = this.newPassword;
      await this.userService.updateUser(this.userInfo);

      var ui = this.userService.getUserInfo();

      if (ui) {
        this.userInfo = ui;
      }

      alert('Пароль було змінено');
      this.newPassword = '';
      this.oldPassword = '';

    } else {
      alert('Невірний пароль!');
    }
  }

}
