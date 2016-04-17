﻿require("bootstrap-loader");
import {Component} from "angular2/core";
import {Router, RouteConfig, RouterOutlet, RouterLink, ROUTER_DIRECTIVES} from "angular2/router";
import {LoginComponent} from "./login/login.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {ScanComponent} from "./scan/scan.component";
import {SetPinComponent} from "./set-pin/set-pin.component";
import {ImportComponent} from "./import/import.component";
import {AuthenticationService} from "./authentication/authentication.service.ts";

@Component({
    selector: "coder-dojo-app",
    template: require("./app.component.html"),
	styles: [require("./app.component.scss")],
	directives: [RouterOutlet, RouterLink, ROUTER_DIRECTIVES],
	providers: [AuthenticationService]
})
@RouteConfig([
	{ path: "/login", name: "Login", component: LoginComponent },
	{ path: "/participants", name: "Participants", component: ParticipantsComponent },
	{ path: "/scan", name: "Scan", component: ScanComponent },
	{ path: "/set-pin", name: "SetPin", component: SetPinComponent },
	{ path: "/import", name: "Import", component: ImportComponent }
])
export class AppComponent {
	constructor(private authenticationService: AuthenticationService, private router: Router) {
		var that = this;

		authenticationService.login().then(
			() => {
				that.router.navigate(["Scan"]);
			}, (reason) => {
				alert("error: " + reason);
			});
	}
}