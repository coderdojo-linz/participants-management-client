import {Injectable} from "angular2/core";
import {Http, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

@Injectable()
export class CDHttpService {
	//private serviceUrl: string = "http://192.168.1.159:1337";
	private serviceUrl: string = "https://participants-management-service.azurewebsites.net";

	constructor(private http: Http, private authenticationService: AuthenticationService) {
	}

	public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.http.get(this.serviceUrl + url, this.buildOptions(options));
	}

	public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.http.post(this.serviceUrl + url, body, this.buildOptions(options));
	}

	private buildOptions(customOptions?: RequestOptionsArgs) {
		var options = { headers: this.authenticationService.getHttpHeaders() };
		return Object.assign(options, customOptions);
	}
}