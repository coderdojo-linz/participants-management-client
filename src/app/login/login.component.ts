import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { environment } from './../../environments/environment';

// Avoid name not found warnings
//declare var Auth0Lock: any;
let Auth0Lock = require('auth0-lock').default;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Configure Auth0
  lock = new Auth0Lock(environment.auth0ClientId, environment.auth0Domain, {
    container: 'login-container',
    rememberLastLogin: true,
    language: 'de'
  });

  constructor(private authService: AuthService, private router: Router) {
    // Set userProfile attribute of already saved profile
    this.authService.userProfile = JSON.parse(localStorage.getItem('profile'));

    // Add callback for lock `authenticated` / 'hash_parsed' event
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.authService.userProfile = profile;
        this.router.navigate([''])
      });
    });
  }

  ngOnInit() {
    this.lock.show();
  }
}
