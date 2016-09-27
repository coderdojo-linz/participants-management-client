import {Injectable} from "@angular/core";
import {Http, HttpModule, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./../authentication/authentication.service.ts";

@Injectable()
export class CDHttpService {
	private serviceUrl: string = "https://participants-management-api.azurewebsites.net";

	constructor(private http: Http, private authenticationService: AuthenticationService) {
	}

	public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.http.get(this.serviceUrl + url, this.buildOptions(options)).map(this.checkResponse).catch(this.handleError);
	}

	public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.http.post(this.serviceUrl + url, body, this.buildOptions(options)).map(this.checkResponse).catch(this.handleError);
	}

	private buildOptions(customOptions?: RequestOptionsArgs) {
		var options = {
			headers: this.buildHttpHeaders()
		};

		return Object.assign(options, customOptions);
	}

	private buildHttpHeaders(): Headers {
		var headers = new Headers();
		headers.append("Authorization", "Bearer " + this.authenticationService.getToken());
		return headers;
	}

	private checkResponse(response: Response): Response {
		if (response.status < 200 || response.status >= 300) {
			alert("Could not load data, response status: " + response.status);
			throw new Error("Bad response status: " + response.status);
		}

		return response;
	}

	private handleError(error: any) {
		let errMsg = error.message || "Server error";
		console.error(error);
		return Observable.throw(errMsg);
	}
}