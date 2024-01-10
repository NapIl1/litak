import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './services/guards/auth.guard';
import { PilotComponent } from './pages/pilot/pilot.component';
import { PpoComponent } from './pages/ppo/ppo.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RoleGuard } from './services/guards/role.guard';
import { UserRole } from './models/user';
import { OptionsComponent } from './pages/admin/components/options/options.component';
import { UsersComponent } from './pages/admin/components/users/users.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { FlightsStatsComponent } from './pages/admin/components/flights-stats/flights-stats.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'personal-info',
        pathMatch: 'full'
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent
      },
      {
        path: 'new-flight',
        component: PilotComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.PILOT] }
      },
      {
        path: 'flight/:id',
        component: PilotComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.PILOT] }
      },
      {
        path: 'ppo',
        component: PpoComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.PPO, UserRole.REB] }
      },
      {
        path: 'admin',
        component: AdminComponent,
        children: [
          {
            path: '',
            redirectTo: 'options',
            pathMatch: 'full'
          },
          {
            path: 'options',
            component: OptionsComponent,

          },
          {
            path: 'users',
            component: UsersComponent,
          },
          {
            path: 'flights',
            component: FlightsStatsComponent,
          },
        ],
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
