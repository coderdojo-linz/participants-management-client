import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
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
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Event';
  showYAxisLabel = true;
  yAxisLabel = 'Teilnehmer';

  colorScheme = {
    domain: ['#9C27B0', '#2196F3']
  };
  data: any[] = [ ];

  constructor(private authHttp: AuthHttp, private dataService: DataService) {
  }

  ngOnInit() {
    this.authHttp.get('http://participants-management-service.azurewebsites.net/api/participants/statistics/gender')
      .map(data => data.json())
      .subscribe(data => {
        if (data) {
          var result = [];
          data.forEach(item => {
            if (item.eventDate <= (new Date()).toISOString()) {
              var events = result.filter(r => r.name == item.eventDate.toString().substr(0, 10));
              var event: any;
              if (events.length > 0) {
                event = events[0];
              } else {
                event = { 'name': item.eventDate.toString().substr(0, 10), 'series': []};
                result.push(event);
              }

              event.series.push({ 'name': item.gender == 'f' ? 'Girls' : (item.gender == 'm'? 'Boys' : 'Not assigned'), 'value': item.checkedin });
            }
          });
          this.dataGirlsBoys = result;
        } else {
          this.dataGirlsBoys = [];
        }
      },
      error => {
        console.error(error);
        this.dataGirlsBoys = [];
      });
  }

  onSelect(event) {
    console.log(event);
  }
}
