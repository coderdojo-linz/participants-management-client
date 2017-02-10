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
	public registrations: Registration[] = [];
	public badgePages: BadgePage[];
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
					var sortedRegistrations = data.sort((a, b) => a.participant.givenName.toLowerCase() > b.participant.givenName.toLowerCase() ? 1 : 
						(a.participant.givenName.toLowerCase() == b.participant.givenName.toLowerCase() && a.participant.familyName.toLowerCase() > b.participant.familyName.toLowerCase() ? 1 : -1));
					this.numberOfNotebooks = this.registrations.filter(r => r.needsComputer).length;
					this.numberOfCheckedInParticipants = this.registrations.filter(r => r.checkedin).length;

					var index = 0;
					sortedRegistrations.splice(index, 0, { markerText: "A, B, C" });
					index = sortedRegistrations.findIndex(r => r.participant != null && r.participant.givenName.toLowerCase().startsWith("d"))
					sortedRegistrations.splice(index, 0, { markerText: "D, E" });
					index = sortedRegistrations.findIndex(r => r.participant != null && r.participant.givenName.toLowerCase().startsWith("f"))
					sortedRegistrations.splice(index, 0, { markerText: "F, G, H, I" });
					index = sortedRegistrations.findIndex(r => r.participant != null && r.participant.givenName.toLowerCase().startsWith("j"))
					sortedRegistrations.splice(index, 0, { markerText: "J, K" });
					index = sortedRegistrations.findIndex(r => r.participant != null && r.participant.givenName.toLowerCase().startsWith("l"))
					sortedRegistrations.splice(index, 0, { markerText: "L" });
					index = sortedRegistrations.findIndex(r => r.participant != null && r.participant.givenName.toLowerCase().startsWith("m"))
					sortedRegistrations.splice(index, 0, { markerText: "M, N, O" });
					index = sortedRegistrations.findIndex(r => r.participant != null && r.participant.givenName.toLowerCase().startsWith("p"))
					sortedRegistrations.splice(index, 0, { markerText: "P, Q, R, S" });
					index = sortedRegistrations.findIndex(r => r.participant != null && r.participant.givenName.toLowerCase().startsWith("t"))
					sortedRegistrations.splice(index, 0, { markerText: "T - Z" });

					var chunkSize = 8
					this.registrations = sortedRegistrations;
					var pages: BadgePage[] = [];
					while (sortedRegistrations.length > 0) {
					    pages.push({ registrations: sortedRegistrations.splice(0, chunkSize) });
					}

					this.badgePages = pages;

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

export interface Registration {
	_id: string;
	needsComputer: boolean;
	checkedin: boolean;
}

export interface BadgePage {
	registrations: Registration[];
}