import { Component, Input, OnChanges, SimpleChange } from "@angular/core";
import { CDHttpService } from "./../http/cdhttp.service";
import { DataService, CoderDojoEvent } from "./../data/data.service";
import "rxjs/Rx";

@Component({
	template: require("./participantsPoints.component.html"),
	styles: [require("./participantsPoints.component.scss")],
	providers: [CDHttpService, DataService]
})
export class ParticipantsPointsComponent {
	public registrations: Registrations[] = [];
	public checkinLimit: number = 5;

	constructor(private cdHttpService: CDHttpService, private dataService: DataService) {
		this.loadParticipants();
	}

	public loadParticipants() {
		this.cdHttpService.get("/api/participants/statistics?checkinLimit=" + this.checkinLimit)
			.map(data => data.json())
			.subscribe(data => {
				if (data) {
					this.registrations = data;
				} else {
					this.registrations = [];
				}
			},
			error => {
				console.error(error);
				this.registrations = [];
			});
	}
}

export interface Registrations {
	_id: string;
	givenName: string;
	familyName: string;
	email: string;
	totalNumberOfCheckins: number;
}