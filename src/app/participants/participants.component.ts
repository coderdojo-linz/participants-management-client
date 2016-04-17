import {Component, Input, OnChanges, SimpleChange} from "angular2/core";
import {HTTP_PROVIDERS, Http, Headers} from "angular2/http";
import {AuthenticationService} from "./../authentication/authentication.service.ts";
import "rxjs/Rx";

@Component({
    template: require("./participants.component.html"),
	styles: [require("./participants.component.scss")],
	providers: [HTTP_PROVIDERS, AuthenticationService]
})
export class ParticipantsComponent {
	public events: CoderDojoEvent[] = [];
	public selectedEvent: string;
	public registrations: Registrations[] = [];
	public numberOfCheckedInParticipants: number = 0;
	
	constructor(private http: Http, private authenticationService: AuthenticationService) {
		this.loadEvents();
	}

	public loadParticipants() {
		this.http.get(this.authenticationService.getServiceUrl() + "/api/events/" + this.selectedEvent + "/registrations", { headers: this.authenticationService.getHttpHeaders() })
			.map(data => data.json())
			.subscribe(data => {
				if (data) {
					this.registrations = data;
					this.numberOfCheckedInParticipants = this.registrations.filter(r => r.checkedin).length;
				} else {
					this.registrations = [];
					this.numberOfCheckedInParticipants = 0;
				}
			},
			error => {
				console.error(error);
				this.registrations = [];
				this.numberOfCheckedInParticipants = 0;
			});
	}

	public loadParticipantsFromEventbrite() {
		this.http.post(this.authenticationService.getServiceUrl() + "/admin/eventbrite-sync", "", { headers: this.authenticationService.getHttpHeaders() })
			.subscribe(data => {
				this.loadParticipants();
			},
			error => {
				console.error(error);
			});
	}

	private loadEvents() {
		var datePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
		this.http.get(this.authenticationService.getServiceUrl() + "/api/events")
			.map(data => data.json())
			.map(data => {
				var arrayData = <any[]>data;
				arrayData.forEach(item => {
					Object.getOwnPropertyNames(item).forEach((property, index, array) => {
						if (typeof item[property] == "string") {
							if ((<string>item[property]).match(datePattern)) {
								item[property] = Date.parse(item[property]);
							}
						}
					});
				});

				return arrayData;
			})
			.subscribe(data => this.events = data,
			error => console.error(error),
			() => {
				this.selectedEvent = this.events.filter((event: CoderDojoEvent) => (new Date(event.date)).setHours(0, 0, 0, 0) >= (new Date()).setHours(0, 0, 0, 0))[0]._id;
				this.loadParticipants();
			});
	}
}

export interface CoderDojoEvent {
	_id: string;
	location: string;
	date: string;
}

export interface Registrations {
	_id: string;
	checkedin: boolean;
}