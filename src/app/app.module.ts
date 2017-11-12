import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { Router, Routes, RouterModule } from '@angular/router';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import  {MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { AppComponent } from './app.component';
import { ParticipantsComponent } from './participants/participants.component';
import { LoginComponent } from './login/login.component';
import { ScanComponent } from './scan/scan.component';
import { BadgesComponent } from './badges/badges.component';
import { DataService } from './data/data.service';
import { AttendeesComponent } from './reports/attendees/attendees.component';
import { CheckInComponent } from './check-in/check-in.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({}), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    ParticipantsComponent,
    LoginComponent,
    ScanComponent,
    BadgesComponent,
    AttendeesComponent,
    CheckInComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    NgxChartsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    FlexLayoutModule,
    RouterModule.forRoot([
      { path: '', component: AttendeesComponent },
      { path: 'login', component: LoginComponent },
      { path: 'scan', component: ScanComponent, canActivate: [AuthGuardService] },
      { path: 'check-in', component: CheckInComponent, canActivate: [AuthGuardService] },
      { path: 'participants', component: ParticipantsComponent, canActivate: [AuthGuardService] },
      { path: 'badges', component: BadgesComponent, canActivate: [AuthGuardService] },
      { path: 'reports', component: AttendeesComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [
    AuthService,
    AuthGuardService,
    DataService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
