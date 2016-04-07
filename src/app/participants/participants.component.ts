import {Component, Input, OnChanges, SimpleChange} from "angular2/core";
import {HTTP_PROVIDERS, Http, Headers} from "angular2/http";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

@Component({
    template: require("./participants.component.html"),
	providers: [HTTP_PROVIDERS, AuthenticationService]
})
export class ParticipantsComponent {
	public events: CoderDojoEvent[] = [];
	public selectedEvent: string;
	
	constructor(private http: Http, private authenticationService: AuthenticationService) {
		this.loadEvents();
	}

	ngOnChanges(changeRecord) {
		console.log(changeRecord);
	}

	public loadParticipants() {
		console.log("load participants: " + this.selectedEvent);
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