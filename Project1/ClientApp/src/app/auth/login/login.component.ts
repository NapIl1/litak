import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  error = false;
  isLoading = false;

  constructor(private userService: UserService, private router: Router) {

  }

  public async login(): Promise<void> {
    this.isLoading = true;

    try {
      const userInfo = await this.userService.login(this.username, this.password);

      if (userInfo?.role == UserRole.ADMIN) {
        this.router.navigate(['admin']);
      }
  
      if (userInfo?.role == UserRole.PILOT) {
        this.router.navigate(['flight']);
      }
  
      if (userInfo?.role == UserRole.PPO) {
        this.router.navigate(['ppo']);
      }
  
      if (userInfo?.role == UserRole.REB) {
        this.router.navigate(['ppo']);
      }
    } catch (error) {
      this.error = true;
    }

    this.isLoading = false;
  }

  modelChanged() {
    if(this.error === true) {
      this.error = false;
    }
  }

}
