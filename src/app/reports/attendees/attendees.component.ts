import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.sass']
})
export class AttendeesComponent implements OnInit {
  view: any[] = [700, 400];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Event';
  showYAxisLabel = true;
  yAxisLabel = 'Participants';

  colorScheme = {
    domain: ['#00BCD4', '#8BC34A', '#FFC107', '#FF5722']
  };
  data: any[] = [
    {
      "name": "2017-04-07",
      "series": [
        {
          "name": "Girls",
          "value": 7300000
        },
        {
          "name": "Boys",
          "value": 8940000
        }
      ]
    },
    {
      "name": "2017-04-21",
      "series": [
        {
          "name": "Girls",
          "value": 7870000
        },
        {
          "name": "Boys",
          "value": 8270000
        }
      ]
    },
    {
      "name": "2017-05-05",
      "series": [
        {
          "name": "Girls",
          "value": 5000002
        },
        {
          "name": "Boys",
          "value": 5800000
        }
      ]
    }
  ];
  
  constructor() {
  }

  ngOnInit() {
  }

  onSelect(event) {
    console.log(event);
  }
}
