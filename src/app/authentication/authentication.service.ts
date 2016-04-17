import {Injectable} from "angular2/core";
import {Headers} from "angular2/http";

@Injectable()
export class AuthenticationService {
	private clientId = "682790434079-ild2uguq4td7h8f5hcqk22str8padhh9.apps.googleusercontent.com";
	private apiKey = "iuGUoOfzdftoufCpBoMIjlom";
	private scopes = "https://www.googleapis.com/auth/userinfo.email";
	private responseTypes = "token id_token";
	private retryAttempts = 0;
	private resolveLogin: any;
	private rejectLogin: any;

	public login() {
		// TODO: check if user is already signed in
		var promise = new Promise((resolve, reject) => {
			this.resolveLogin = resolve;
			this.rejectLogin = reject;

			this.executeScript();
		});

		return promise;
	}

	public getToken() {
		var token = <any>gapi.auth.getToken();
		if (token) {
			console.log(token);
			return token.id_token;
		} else {
			console.log("Could not get token");
			return null;
		}
	}

	public getHttpHeaders(): Headers {
		var headers = new Headers();
		headers.append("Authorization", "Bearer " + this.getToken());
		return headers;
	}

	private loadScript(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			var url = "https://apis.google.com/js/client.js";
			var script = document.createElement("script");
			script.onerror = function (e) {
				reject();
			};

			script.src = url;
			document.body.appendChild(script);
			resolve();
		});
	}

	private executeScript() {
		window.setTimeout(() => {
			var gapi = (<any>window).gapi;
			if (gapi) {
				gapi.load("auth2", () => {
					gapi.client.setApiKey(this.apiKey);
					this.authorize(true);
				});
			} else {
				console.log("retry execute script");
				this.retryAttempts++;

				if (this.retryAttempts < 10) {
					this.executeScript();
				}
			}
		}, 50);
	}

	private authorize(immediate: boolean) {
		gapi.auth.authorize(
			{ client_id: this.clientId, scope: this.scopes, immediate: immediate, response_type: this.responseTypes },
			(authResult: any) => {
				if (authResult && !authResult.error) {
					this.resolveLogin();
				} else {
					if (immediate) {
						console.log("no immediate authentication");
						this.authorize(false);
					} else {
						alert("authentication failed");
						this.rejectLogin();
					}
				}
			});
	}
}