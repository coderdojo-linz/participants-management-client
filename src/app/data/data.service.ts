import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {CDHttpService} from "./../http/cdhttp.service.ts";

@Injectable()
export class DataService {
	constructor(private cdHttpService: CDHttpService) {
	}

	public getEvents(): Observable<CoderDojoEvent[]> {
		var datePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

		return this.cdHttpService.get("/api/events?past=true")
			.map(data => data.json())
			.map(data => {
				var arrayData = <any[]>data;
				arrayData.forEach(item => {
					Object.getOwnPropertyNames(item).forEach((property, index, array) => {
						if (typeof item[property] == "string") {
							if ((<string>item[property]).match(datePattern)) {
								item[property] = Date.parse(item[property]);
							}
						}
					});
				});

				return arrayData;
			});
	}
}

export interface CoderDojoEvent {
	_id: string;
	location: string;
	date: string;
}