import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService { 
	// Store profile object in auth class
	userProfile: any;

	constructor(private router: Router) {
		// Set userProfile attribute of already saved profile
    	this.userProfile = JSON.parse(localStorage.getItem('profile'));
	}

	public authenticated() {
		// Check if there's an unexpired JWT
		// This searches for an item in localStorage with key == 'id_token'
		return tokenNotExpired();
	}

	public logout() {
		// Remove token from localStorage
		localStorage.removeItem('id_token');
		localStorage.removeItem('profile');
		this.userProfile = undefined;
		this.router.navigate(['login']);
	}

	public hasRole(role: string): boolean {
		return this.userProfile && this.userProfile.app_metadata
			&& this.userProfile.app_metadata.roles
			&& this.userProfile.app_metadata.roles.indexOf(role) > -1;
	}
}
