import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Router, Routes, RouterModule} from '@angular/router';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { AppComponent } from './app.component';
import { ParticipantsComponent } from './participants/participants.component';
import { LoginComponent } from './login/login.component';
import { ScanComponent } from './scan/scan.component';

@NgModule({
  declarations: [
    AppComponent,
    ParticipantsComponent,
    LoginComponent,
    ScanComponent
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
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [ 
    AuthService,
    AuthGuardService,
    AUTH_PROVIDERS 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
