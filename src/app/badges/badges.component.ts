import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { DataService, CoderDojoEvent } from './../data/data.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {
	public events: any[] = [];
	public selectedEvent: string;
	public registrations: Registration[] = [];
	public badgePages: BadgePage[];
	public numberOfNotebooks: number = 0;
	public numberOfCheckedInParticipants: number = 0;
  
  constructor(private authHttp: AuthHttp, private dataService: DataService) { 
    this.loadEvents();
  }

  ngOnInit() {
    
  }

  public loadParticipants() {
		this.dataService.getParticipants(this.selectedEvent)
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
    this.authHttp.get("https://participants-management-api.azurewebsites.net/api/events?past=true")
      .map(res => res.json())
      .subscribe(
      data => this.events = data,
      error => console.log("error: " + error._body || error),
      () => {
        this.selectedEvent = this.events.filter((event: any) => (new Date(event.date)).setHours(0, 0, 0, 0) >= (new Date()).setHours(0, 0, 0, 0))[0]._id; 
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
