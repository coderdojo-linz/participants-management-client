import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  public events: any[] = [];
  public selectedEvent: string;
  public registrations: any[] = [];
  public numberOfNotebooks: number = 0;
  public numberOfCheckedInParticipants: number = 0;

  constructor(private authHttp: AuthHttp) { }

  ngOnInit() {
    var datePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

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

  loadParticipants() {
    this.authHttp.get("https://participants-management-api.azurewebsites.net/api/events/" + this.selectedEvent + "/registrations?stats=true")
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
}
