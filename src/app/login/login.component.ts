import {Component} from "angular2/core";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

@Component({
    template: require("./login.component.html"),
	providers: [AuthenticationService]
})
export class LoginComponent {
	constructor(private authenticationService: AuthenticationService) {
	}

	private login() {
		this.authenticationService.authorize(false);
	}
}