import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './services/guards/auth.guard';
import { PilotComponent } from './pages/pilot/pilot.component';
import { PpoComponent } from './pages/ppo/ppo.component';
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'pilot',
        redirectTo: 'pilot/',
        pathMatch: 'full',
      },
      {
        path: 'pilot/:id',
        component: PilotComponent,
      },
      {
        path: 'ppo',
        component: PpoComponent
      },
      {
        path: 'admin',
        component: AdminComponent
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
