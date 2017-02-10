import { Component, Input, OnChanges, SimpleChange } from "@angular/core";
import { CDHttpService } from "./../http/cdhttp.service";
import { DataService, CoderDojoEvent } from "./../data/data.service";
import "rxjs/Rx";

@Component({
	template: require("./badges.component.html"),
	styles: [require("./badges.component.scss")],
	providers: [CDHttpService, DataService]
})
export class BadgesComponent {
	public events: CoderDojoEvent[] = [];
	public selectedEvent: string;
	public registrations: Registrations[] = [];
	public numberOfNotebooks: number = 0;
	public numberOfCheckedInParticipants: number = 0;

	public bar_ChartData = [
		["City", "2010 Population", "2000 Population"],
		["New York City, NY", 8175000, 8008000],
		["Los Angeles, CA", 3792000, 3694000],
		["Chicago, IL", 2695000, 2896000],
		["Houston, TX", 2099000, 1953000],
		["Philadelphia, PA", 1526000, 1517000]];

	constructor(private cdHttpService: CDHttpService, private dataService: DataService) {
		this.loadEvents();
	}

	public loadParticipants() {
		this.cdHttpService.get("/api/events/" + this.selectedEvent + "/registrations?stats=true")
			.map(data => data.json())
			.subscribe(data => {
				if (data) {
					this.registrations = data.sort((a, b) => a.participant.givenName.toLowerCase() > b.participant.givenName.toLowerCase());
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