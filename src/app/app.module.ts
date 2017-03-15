import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import {Router, Routes, RouterModule} from '@angular/router';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';

import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { AppComponent } from './app.component';
import { ParticipantsComponent } from './participants/participants.component';
import { LoginComponent } from './login/login.component';
import { ScanComponent } from './scan/scan.component';
import { BadgesComponent } from './badges/badges.component';
import { DataService } from './data/data.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({}), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    ParticipantsComponent,
    LoginComponent,
    ScanComponent,
    BadgesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: ScanComponent, canActivate: [AuthGuardService] },
      { path: 'login', component: LoginComponent },
      { path: 'scan', component: ScanComponent, canActivate: [AuthGuardService] },
      { path: 'participants', component: ParticipantsComponent, canActivate: [AuthGuardService] },
      { path: 'badges', component: BadgesComponent, canActivate: [AuthGuardService] },
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
      deps: [ Http, RequestOptions ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
