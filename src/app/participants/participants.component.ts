import {Component} from "angular2/core";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

@Component({
    template: require("./participants.component.html"),
	providers: [AuthenticationService]
})
export class ParticipantsComponent {
	constructor(private authenticationService: AuthenticationService) {
		var that = this;

		alert(that.authenticationService.getToken());
	}
}