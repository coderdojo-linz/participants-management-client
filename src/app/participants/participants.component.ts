import {Component, Input, OnChanges, SimpleChange} from "@angular/core";
import {CDHttpService} from "./../http/cdhttp.service.ts";
import {DataService, CoderDojoEvent} from "./../data/data.service.ts";
import "rxjs/Rx";

@Component({
    template: require("./participants.component.html"),
	styles: [require("./participants.component.scss")],
	providers: [CDHttpService, DataService]
})
export class ParticipantsComponent {
	public events: CoderDojoEvent[] = [];
	public selectedEvent: string;
	public registrations: Registrations[] = [];
	public numberOfNotebooks: number = 0;
	public numberOfCheckedInParticipants: number = 0;
	
	constructor(private cdHttpService: CDHttpService, private dataService: DataService) {
		this.loadEvents();
	}

	public loadParticipants() {
		this.cdHttpService.get("/api/events/" + this.selectedEvent + "/registrations?stats=true")
			.map(data => data.json())
			.subscribe(data => {
				if (data) {
					this.registrations = data;
					this.numberOfNotebooks = this.registrations.filter(r => r.needsComputer).length;
					this.numberOfCheckedInParticipants = this.registrations.filter(r => r.checkedin).length;
				} else {
					this.registrations = [];
					this.numberOfNotebooks = 0;
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
		this.cdHttpService.post("/admin/eventbrite-sync", "")
			.subscribe(data => {
				this.loadParticipants();
			},
			error => {
				console.error(error);
			});
	}

	private loadEvents() {
		this.dataService.getEvents()
			.subscribe(data => this.events = data,
			error => console.error(error),
			() => {
				this.selectedEvent = this.events.filter((event: CoderDojoEvent) => (new Date(event.date)).setHours(0, 0, 0, 0) >= (new Date()).setHours(0, 0, 0, 0))[0]._id;
				this.loadParticipants();
			});
	}
}

export interface Registrations {
	_id: string;
	needsComputer: boolean;
	checkedin: boolean;
}