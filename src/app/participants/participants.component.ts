/// <reference path="../../../typings/jquery/jquery.d.ts" />
import {Component} from "angular2/core";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

declare var jQuery: JQueryStatic;

@Component({
    template: require("./participants.component.html"),
	providers: [AuthenticationService]
})
export class ParticipantsComponent {
	constructor(private authenticationService: AuthenticationService) {
		var that = this;
		(<any>jQuery("#webcam")).scriptcam();
	}
}