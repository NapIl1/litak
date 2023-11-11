import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { PilotComponent } from './pages/pilot/pilot.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PpoComponent } from './pages/ppo/ppo.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { OptionsComponent } from './pages/admin/components/options/options.component';
import { UsersComponent } from './pages/admin/components/users/users.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { FlightsStatsComponent } from './pages/admin/components/flights-stats/flights-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    PilotComponent,
    PpoComponent,
    AdminComponent,
    OptionsComponent,
    UsersComponent,
    PersonalInfoComponent,
    FlightsStatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxMaskDirective,
    HttpClientModule
  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent]
})
export class AppModule { }
