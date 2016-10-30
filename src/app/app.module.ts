import { NgModule }       from "@angular/core";
import { BrowserModule }  from "@angular/platform-browser";
import { FormsModule }    from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent }        from "./app.component";
import { LoginComponent } from "./login/login.component";
import { ParticipantsComponent } from "./participants/participants.component";
import { ParticipantsPointsComponent } from "./participants/participantsPoints.component";
import { BadgesComponent } from "./participants/badges.component";
import { ScanComponent } from "./scan/scan.component";
import { SetPinComponent } from "./set-pin/set-pin.component";
import { ImportComponent } from "./import/import.component";
import { routing } from "./app.routing";

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		routing
	],
	declarations: [
		AppComponent,
		LoginComponent,
		ParticipantsComponent,
		ParticipantsPointsComponent,
		BadgesComponent,
		ScanComponent,
		SetPinComponent,
		ImportComponent
	],
	providers: [
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {
}
