import {Injectable} from "angular2/core";
import {Headers} from "angular2/http";

@Injectable()
export class AuthenticationService {
	private clientId = "682790434079-ild2uguq4td7h8f5hcqk22str8padhh9.apps.googleusercontent.com";
	private apiKey = "iuGUoOfzdftoufCpBoMIjlom";
	private scopes = "https://www.googleapis.com/auth/userinfo.email";
	private responseTypes = "token id_token";
	private auth2: gapi.auth2.GoogleAuth;
	private googleUser: gapi.auth2.GoogleUser;
	private resolveLogin: any;
	private rejectLogin: any;

	public login() {
		// TODO: check if user is already signed in
		var promise = new Promise((resolve, reject) => {
			this.resolveLogin = resolve;
			this.rejectLogin = reject;

			this.loadScript().then(() => {
				this.executeScript();
			}, (reason) => {
				console.log("script could not be loaded");
				console.log(reason);
				reject();
			}).catch(() => {
				reject();
			});
		});

		return promise;
	}

	public getToken() {
		console.log(gapi.auth.getToken());
		return sessionStorage.getItem("gapi_token");
	}

	public getHttpHeaders(): Headers {
		var headers = new Headers();
		headers.append("Authorization", "Bearer " + this.getToken());
		return headers;
	}

	public getServiceUrl(): string {
		//return "http://192.168.1.159:1337";
		return "https://participants-management-service.azurewebsites.net";
	}

	private loadScript(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			var url = "https://apis.google.com/js/client.js?onload=gapiOnLoad";
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
				this.executeScript();
			}
		}, 50);
	}

	private authorize(immediate: boolean) {
		gapi.auth.authorize(
			{ client_id: this.clientId, scope: this.scopes, immediate: immediate, response_type: this.responseTypes },
			(authResult: any) => {
				if (authResult && !authResult.error) {
					sessionStorage.setItem("gapi_token", authResult.id_token);
					this.resolveLogin();
				} else {
					if (immediate) {
						console.log("no immediate authentication");
						this.authorize(false);
					} else {
						console.log("authentication failed");
						this.rejectLogin();
					}
				}
			});
	}
}