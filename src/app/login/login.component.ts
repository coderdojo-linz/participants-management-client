import {Component} from "@angular/core";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

@Component({
    templateUrl: "./login.component.html",
	providers: [AuthenticationService]
})
export class LoginComponent {
	constructor(private authenticationService: AuthenticationService) {
	}

	private login() {
		this.authenticationService.authorize(false);
	}
}