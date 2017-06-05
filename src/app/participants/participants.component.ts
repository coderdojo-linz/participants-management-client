import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { DataService, CoderDojoEvent } from './../data/data.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  public events: any[] = [];
  public selectedEvent: string;
  public registrations: any[] = [];
  public numberOfNotebooks: number = 0;
  public numberOfCheckedInParticipants: number = 0;
  public data: any[] = [];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Event';
  showYAxisLabel = true;
  yAxisLabel = 'Participants';

  public colorScheme = {
    domain: []
  };

  constructor(private authHttp: AuthHttp, private dataService: DataService) { }

  ngOnInit() {
    var datePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

    for (var i = 0; i < 5; i++) { this.colorScheme.domain.push('#d9d9d9'); }
    for (var i = 0; i < 5; i++) { this.colorScheme.domain.push('#ffeb38'); }
    for (var i = 0; i < 5; i++) { this.colorScheme.domain.push('#ff9800'); }
    for (var i = 0; i < 5; i++) { this.colorScheme.domain.push('#8bc34a'); }
    for (var i = 0; i < 5; i++) { this.colorScheme.domain.push('#03A9F4'); }
    for (var i = 0; i < 5; i++) { this.colorScheme.domain.push('#9C27B0'); }

    this.dataService.getEvents()
      .subscribe(
      data => this.events = data,
      error => console.log('error: ' + error._body || error),
      () => {
        this.selectedEvent = this.events.filter((event: CoderDojoEvent) => (new Date(event.date)).setHours(0, 0, 0, 0) >= (new Date()).setHours(0, 0, 0, 0))[0]._id;
        this.loadParticipants();
      });
  }

  loadParticipants() {
    this.authHttp.get('https://participants-management-service.azurewebsites.net/api/events/' + this.selectedEvent + '/registrations?stats=true')
      .map(data => data.json())
      .subscribe(data => {
        if (data) {
          this.registrations = data;
          this.numberOfNotebooks = this.registrations.filter(r => r.needsComputer).length;
          this.numberOfCheckedInParticipants = this.registrations.filter(r => r.checkedin).length;

          var max = 0;
          this.registrations.forEach(registration => {
            if (registration.totalNumberOfCheckins) {
              max = Math.max(max, registration.totalNumberOfCheckins);
            }
          });

          var chartData = [];
          for (var i = 0; i <= max; i++) {
            chartData.push({ "name": i.toString(), "value": this.registrations.filter(r => r.totalNumberOfCheckins == i || (!r.totalNumberOfCheckins && i == 0)).length });
          }

          this.data = chartData;
          console.log(this.data);
        } else {
          this.registrations = [];
          this.numberOfNotebooks = 0;
          this.numberOfCheckedInParticipants = 0;

          this.data = [];
        }
      },
      error => {
        console.error(error);
        this.registrations = [];
        this.numberOfCheckedInParticipants = 0;
      });
  }

  public loadParticipantsFromEventbrite() {
    this.authHttp.post('https://participants-management-service.azurewebsites.net/admin/eventbrite-sync', '')
      .subscribe(data => {
        this.loadParticipants();
      },
      error => {
        console.error(error);
      });
  }
}
