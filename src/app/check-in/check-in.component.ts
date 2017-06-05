import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { DataService, CoderDojoEvent } from './../data/data.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  public events: any[] = [];
  public selectedEvent: string;
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
          this.registrations = data;

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
}
