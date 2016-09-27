require("file?name=google-client.js!./../../components/google/google-client.js");
require("bootstrap-loader");
import {Component} from "@angular/core";
import {Router, Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {ScanComponent} from "./scan/scan.component";
import {SetPinComponent} from "./set-pin/set-pin.component";
import {ImportComponent} from "./import/import.component";
import {AuthenticationService} from "./authentication/authentication.service.ts";
import {LoggedInRouterOutlet} from "./authentication/loggedinrouteroutlet.component.ts";

@Component({
    selector: "coder-dojo-app",
    templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	providers: [AuthenticationService]
})
export class AppComponent {
	constructor(private authenticationService: AuthenticationService, private router: Router) {
		var that = this;

		authenticationService.login().then(
			() => {
				that.router.navigate(["/scan"]);
			}, (reason) => {
				alert("error: " + reason);
			});
	}
}