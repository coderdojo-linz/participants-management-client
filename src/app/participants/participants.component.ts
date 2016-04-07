import {Component, Input, OnChanges, SimpleChange} from "angular2/core";
import {HTTP_PROVIDERS, Http, Headers} from "angular2/http";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

@Component({
    template: require("./participants.component.html"),
	styles: [require("./participants.component.scss")],
	providers: [HTTP_PROVIDERS, AuthenticationService]
})
export class ParticipantsComponent {
	public events: CoderDojoEvent[] = [];
	public selectedEvent: string;
	public participants: Participant[] = [];
	
	constructor(private http: Http, private authenticationService: AuthenticationService) {
		this.loadEvents();
	}

	ngOnChanges(changeRecord) {
		console.log(changeRecord);
	}

	public loadParticipants() {
		this.participants = [{ _id: "test", givenName: "test", lastName: "test", checkedIn: false }];
	}

	private loadEvents() {
		this.http.get(this.authenticationService.getServiceUrl() + "/api/events")
			.subscribe(data => this.events = data.json(),
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

export interface Participant {
	_id: string;
	givenName: string;
	lastName: string;
	checkedIn: boolean;
}