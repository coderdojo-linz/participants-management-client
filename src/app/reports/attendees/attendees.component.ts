import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs/Observable';
import { DataService, CoderDojoEvent } from './../../data/data.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss']
})
export class AttendeesComponent implements OnInit {
  public dataGirlsBoys = [];
  public dataParticipants = [];
  public checkedinLastYear = 0;
  public registeredLastYear = 0;
  public girlsLastYear = 0;
  public boysLastYear = 0;
  public eventsLastYear = 0;
  private countedEvents: any[] = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Event';
  showYAxisLabel = true;
  yAxisLabel = 'Teilnehmer';

  colorSchemeParticipants = {
    domain: ['#2196F3', '#FFC107']
  };

  colorSchemeGirlsBoys = {
    domain: ['#9C27B0', '#2196F3']
  };

  constructor(private http: Http, private authHttp: AuthHttp, private dataService: DataService) {
  }

  ngOnInit() {
    this.http.get('https://participants-management-service.azurewebsites.net/api/participants/statistics/gender')
      .map(data => data.json())
      .subscribe(data => {
        if (data) {
          var resultGirlsBoys = [];
          var resultParticipants = [];
          this.checkedinLastYear = 0;
          this.registeredLastYear = 0;
          this.girlsLastYear = 0;
          this.boysLastYear = 0;
          this.eventsLastYear = 0;
          this.eventsLastYear = 0;
          this.countedEvents = [];

          data.forEach(item => {
            var date = new Date();
            if (item.eventDate <= date.toISOString()) {
              var year = date.getFullYear();
              if (item.eventDate > date.toISOString().replace(year.toString(), (year - 1).toString())) {
                this.registeredLastYear += item.registered;
                this.checkedinLastYear += item.checkedin;
                if (item.gender == "f") {
                  this.girlsLastYear += item.checkedin;
                } else if (item.gender == "m") {
                  this.boysLastYear += item.checkedin;
                }

                if (this.countedEvents.indexOf(item.eventDate) < 0) {
                  this.eventsLastYear++;
                  this.countedEvents.push(item.eventDate);
                }
              }

              // participants
              var events = resultParticipants.filter(r => r.name == item.eventDate.toString().substr(0, 10));
              var event: any;
              if (events.length > 0) {
                event = events[0];
              } else {
                event = {
                  'name': item.eventDate.toString().substr(0, 10),
                  'series': [
                    { 'name': 'Checked-In', 'value': 0 },
                    { 'name': 'Storniert oder nicht gekommen', 'value': 0 }
                  ]
                };
                resultParticipants.push(event);
              }

              event.series[0].value += item.checkedin;
              event.series[1].value += item.registered - item.checkedin;

              // girls / boys
              var events = resultGirlsBoys.filter(r => r.name == item.eventDate.toString().substr(0, 10));
              var event: any;
              if (events.length > 0) {
                event = events[0];
              } else {
                event = { 'name': item.eventDate.toString().substr(0, 10), 'series': [] };
                resultGirlsBoys.push(event);
              }

              event.series.push({ 'name': item.gender == 'f' ? 'Girls' : (item.gender == 'm' ? 'Boys' : 'Not assigned'), 'value': item.checkedin });
            }
          });

          this.dataGirlsBoys = resultGirlsBoys;
          this.dataParticipants = resultParticipants;
        } else {
          this.dataGirlsBoys = [];
          this.dataParticipants = [];
        }
      },
      error => {
        console.error(error);
        this.dataGirlsBoys = [];
        this.dataParticipants = [];
      });
  }

  onSelect(event) {
    console.log(event);
  }
}
