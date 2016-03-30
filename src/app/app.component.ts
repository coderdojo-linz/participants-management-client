require("bootstrap-loader");
import {Component} from "angular2/core";
import {RouteConfig, RouterOutlet, RouterLink, ROUTER_DIRECTIVES} from "angular2/router";
import {LoginComponent} from "./login/login.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {ScanComponent} from "./scan/scan.component";
import {SetPinComponent} from "./set-pin/set-pin.component";
import {ImportComponent} from "./import/import.component";

@Component({
    selector: "coder-dojo-app",
    template: require("./app.component.html"),
	styles: [require("./app.component.scss")],
	directives: [RouterOutlet, RouterLink, ROUTER_DIRECTIVES] 
})
@RouteConfig([
	{ path: "/login", name: "Login", component: LoginComponent },
	{ path: "/participants", name: "Participants", component: ParticipantsComponent, useAsDefault: true },
	{ path: "/scan", name: "Scan", component: ScanComponent },
	{ path: "/set-pin", name: "SetPin", component: SetPinComponent },
	{ path: "/import", name: "Import", component: ImportComponent }
])
export class AppComponent {
}