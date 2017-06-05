import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { DataService, CoderDojoEvent } from './../data/data.service';
import 'rxjs/add/operator/map';

declare var $: any;

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  public events: any[] = [];
  public selectedEvent: string;
  public selectedRegistration: any;
  public registrations: any[] = [];
  public filteredRegistrations: any[] = [];
  public keys: any[];
  public input: string = '';

  constructor(private authHttp: AuthHttp, private dataService: DataService) { }

  ngOnInit() {
    this.keys = [
      ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', 'del'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
      ['y', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    this.dataService.getEvents()
      .subscribe(
      data => this.events = data,
      error => console.log('error: ' + error._body || error),
      () => {
        this.selectedEvent = this.events.filter((event: CoderDojoEvent) => (new Date(event.date)).setHours(0, 0, 0, 0) >= (new Date()).setHours(0, 0, 0, 0))[0]._id;
        this.loadParticipants();
      });
  }

  enterKey(key) {
    if (key == 'del') {
      this.input = '';
    } else {
      this.input += key;
    }

    this.updateFilteredRegistrations();
  }

  loadParticipants() {
    this.authHttp.get('https://participants-management-service.azurewebsites.net/api/events/' + this.selectedEvent + '/registrations?stats=true')
      .map(data => data.json())
      .subscribe(data => {
        if (data) {
          this.registrations = data.sort((a, b) => a.participant.givenName.toLowerCase() > b.participant.givenName.toLowerCase() ? 1 : 
						(a.participant.givenName.toLowerCase() == b.participant.givenName.toLowerCase() && a.participant.familyName.toLowerCase() > b.participant.familyName.toLowerCase() ? 1 : -1));

          var max = 0;
        } else {
          this.registrations = [];
        }

        this.updateFilteredRegistrations();
      },
      error => {
        console.error(error);
        this.registrations = [];
        this.updateFilteredRegistrations();
      });
  }

  updateFilteredRegistrations() {
    if (this.input) {
      this.filteredRegistrations = this.registrations.filter(r => r.participant.givenName.toLowerCase().startsWith(this.input));
    } else {
      this.filteredRegistrations = this.registrations;
    }
  }

  checkin(registration: any) {
    var options = { backdrop: 'static' };
    this.selectedRegistration = registration;
    (<any>$('#welcomeDialog')).modal(options);
  }

  confirmCheckin(registration: any) {
    this.authHttp.post('https://participants-management-service.azurewebsites.net/api/participants/' + registration.participant.id + '/checkin/' + this.selectedEvent,
				'').subscribe(
				data => {
					var result = data.json();
          this.selectedRegistration = null;
					(<any>$('#welcomeDialog')).modal('hide');
          this.loadParticipants();
				},
				error => {
					alert(error);
					console.log(error);
					//this.stop();
					//this.start();
				});
  }

  cancelCheckin() {
    this.selectedRegistration = null;
    (<any>$('#welcomeDialog')).modal('hide');
  }
}
