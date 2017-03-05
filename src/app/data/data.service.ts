import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
  private datePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
  private url: string = 'https://participants-management-api.azurewebsites.net/api/';

  constructor(private authHttp: AuthHttp) { }

  public getEvents(): Observable<CoderDojoEvent[]> {
    return this.authHttp.get(this.url + 'events?past=true')
      .map(data => data.json())
      .map(data => {
        var arrayData = <any[]>data;
        arrayData.forEach(item => {
          Object.getOwnPropertyNames(item).forEach((property, index, array) => {
            if (typeof item[property] == "string") {
              if ((<string>item[property]).match(this.datePattern)) {
                item[property] = Date.parse(item[property]);
              }
            }
          });
        });

        return arrayData;
      });
  }

  public getParticipants(event: string): Observable<any[]> {
    return this.authHttp.get(this.url + 'events/' + event + '/registrations?stats=true')
			.map(data => data.json());
  }
}

export interface CoderDojoEvent {
  _id: string;
  location: string;
  date: Date;
}
