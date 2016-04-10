import {Injectable} from "angular2/core";
import {Headers} from "angular2/http";

@Injectable()
export class AuthenticationService {
	private clientId = "682790434079-ild2uguq4td7h8f5hcqk22str8padhh9.apps.googleusercontent.com";
	private scopes = "https://www.googleapis.com/auth/userinfo.email";
	private responseTypes = "token id_token";
	private scriptLoaded: boolean = false;
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
			if (this.scriptLoaded) {
				return resolve();
			} else {
				var url = "https://apis.google.com/js/client.js?onload=gapiOnLoad";
				var script = document.createElement("script");
				script.onerror = function (e) {
					reject();
				};

				script.src = url;
				document.body.appendChild(script);
				resolve();
			}
		});
	}

	private executeScript() {
		window.setTimeout(() => {
			var gapi = (<any>window).gapi;
			if (gapi) {
				gapi.load("auth2", () => this.initAuth2());
			} else {
				console.log("retry execute script");
				this.executeScript();
			}
		}, 100);
	}

	private initAuth2() {
		var that = this;
		this.auth2 = gapi.auth2.init({
			client_id: this.clientId,
			scope: this.scopes
		});

		var options = { client_id: this.clientId, scope: this.scopes, immediate: false, authuser: -1, response_type: this.responseTypes };
		this.auth2.signIn(options).then(() => {
			this.updateUser();
		});
	};

	private updateUser() {
		if (this.auth2) {
			this.googleUser = this.auth2.currentUser.get();

			if (this.googleUser) {
				if (this.googleUser["hg"]) {
					sessionStorage.setItem("gapi_token", this.googleUser["hg"].id_token);
					this.resolveLogin();
				}
			} else {
				sessionStorage.removeItem("gapi_token");
				this.rejectLogin();
			}
		}
	}
}