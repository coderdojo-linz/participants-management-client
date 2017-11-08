import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { DataService, CoderDojoEvent } from './../data/data.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

declare var $: any;

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
  animations: [
    trigger('flyInOut', [
      // state('in', style({transform: 'translateX(0)'})),
      // transition('void => *', [
      //   style({transform: 'translateX(-100vw)'}),
      //   animate(200)
      // ]),
      // transition('* => void', [
      //   animate(200, style({transform: 'translateX(100vw)'}))
      // ])
      state('in', style({width: 'auto'})),
      transition('void => *', [
        style({width: '0'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({width: '0'}))
      ])
    ])
  ]
})
export class CheckInComponent implements OnInit, AfterViewChecked {
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

  ngAfterViewChecked() {
    var height = screen.height - $('.keyboard-container').height() - 420;
    console.log(height);
    $('.participants-container').height(height);
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
    var events = this.events
      .filter((event: CoderDojoEvent) => (new Date(event.date)).setHours(0, 0, 0, 0) <= (new Date()).setHours(0, 0, 0, 0))
      .sort((event1, event2) => {
        var date1 = new Date(event1.date);
        var date2 = new Date(event2.date);
        return date1 > date2 ? -1 : 1;
      })
      .slice(0, 20);

    var responses = [];
    events.forEach(event => {
      responses.push(this.authHttp.get('https://participants-management-service.azurewebsites.net/api/events/' + event._id + '/registrations?stats=true').map(data => {
        var response = data.json();
        if (event._id != this.selectedEvent) {
          response.forEach(item => {
            delete item.checkedin;
          });
        }
        return response;
      }));
    });

    Observable.forkJoin(responses).subscribe((responses: any[]) => {
      if (responses.length > 0) {
        var data: any[] = [];
        for (var i = 0; i < responses.length; i++) {
          responses[i].forEach(item => {
            var filteredResponses = data.filter(registration => registration.participant.id == item.participant.id);
            if (filteredResponses.length <= 0) {
              data.push(item);
            } else {
              if (item.checkedin) {
                filteredResponses[0].checkedin = true;
              }
            }
          });
        }

        if (data) {
          this.registrations = data.sort((a, b) => a.participant.givenName.toLowerCase() > b.participant.givenName.toLowerCase() ? 1 :
            (a.participant.givenName.toLowerCase() == b.participant.givenName.toLowerCase() && a.participant.familyName.toLowerCase() > b.participant.familyName.toLowerCase() ? 1 : -1));

          var max = 0;
        } else {
          this.registrations = [];
        }

        this.updateFilteredRegistrations();
      }
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
      this.filteredRegistrations = [];
    }
  }

  checkin(registration: any) {
    var options = { backdrop: 'static' };
    this.selectedRegistration = registration;

    var audio = $("#fanfareAudio")[0];
    audio.play();

    (<any>$('#welcomeDialog')).modal(options);
  }

  confirmCheckin(registration: any) {
    this.authHttp.post('https://participants-management-service.azurewebsites.net/api/participants/' + registration.participant.id + '/checkin/' + this.selectedEvent,
      '').subscribe(
      data => {
        var result = data.json();
        this.selectedRegistration.checkedin = true;

        if (this.selectedRegistration) {
          this.selectedRegistration.totalNumberOfCheckins = result.numberOfCheckins;
        }
        setTimeout(() => {
          this.selectedRegistration = null;
          this.input = '';
          this.updateFilteredRegistrations();
        }, 1000)

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
