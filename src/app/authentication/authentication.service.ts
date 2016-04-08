import {Injectable} from "angular2/core";
import {Headers} from "angular2/http";

@Injectable()
export class AuthenticationService {
	private token: string;
	private clientId = "682790434079-ild2uguq4td7h8f5hcqk22str8padhh9.apps.googleusercontent.com";
	private scopes = "profile email";
	private scriptLoaded: boolean = false;
	private auth2: gapi.auth2.GoogleAuth;
	private googleUser: gapi.auth2.GoogleUser;
	private signedIn: boolean = false;
	private promiseResolve: any;

	constructor() {
		// TODO: check if token in local storage is valid
	}

	public login() {
		var that = this;
		var promise = new Promise((resolve, reject) => {
			that.promiseResolve = resolve;
			that.loadScript().then((scriptLoaded) => {
				if (scriptLoaded) {
					that.executeScript();
				} else {
					reject();
				}
			}).catch(() => {
				reject();
			});
		});

		return promise;
	}

	public getToken() {
		return localStorage.getItem("gapi_token");
	}

	public getHttpHeaders(): Headers {
		var headers = new Headers();
		headers.append("Authorization", "Bearer " + this.getToken());
		return headers;
	}

	public getServiceUrl(): string {
		return "http://192.168.1.159:1337";
	}

	private loadScript(): Promise<boolean> {
		var that = this;
		return new Promise((resolve, reject) => {
			if (that.scriptLoaded) {
				return resolve(true);
			} else {
				var url = "https://apis.google.com/js/client.js?onload=gapiOnLoad";
				var script = document.createElement("script");
				script.onerror = function (e) {
					resolve(false);
				};

				script.src = url;
				document.body.appendChild(script);
				resolve(true);
			}
		});
	}

	private executeScript() {
		var that = this;
		window.setTimeout(() => {
			var gapi = (<any>window).gapi;
			if (gapi) {
				gapi.load("auth2", () => that.initAuth2());
			} else {
				console.log("retry execute script");
				that.executeScript();
			}
		}, 100);
	}

	private initAuth2() {
		var that = this;
		that.auth2 = gapi.auth2.init({
			client_id: that.clientId,
			scope: that.scopes
		});

		// Sign in the user if they are currently signed in.
		if (that.auth2.isSignedIn.get()) {
			that.auth2.signIn();
			that.updateUser();
		} else {
			var origin = location.protocol + "//" + location.hostname;
			if (location.port != "" || (location.port != "443" && location.protocol == "https")) {
				origin = origin + ":" + location.port;
			}

			var authWindow = window.open("https://accounts.google.com/o/oauth2/auth?scope=" + encodeURI(that.scopes) + "&redirect_uri=postmessage&response_type=code&client_id=" + that.clientId + "&access_type=online&origin=" + origin, null, "width=800, height=600");
			window.addEventListener("message", (event: any) => {
				if (event.origin === "https://accounts.google.com" && event.data) {
					var data = JSON.parse(event.data);
					if (data.result && data.result.id_token) {
						that.updateUser();
					}
				}
			});
		}
	};

	private updateUser() {
		var that = this;
		if (that.auth2) {
			that.googleUser = this.auth2.currentUser.get();

			if (that.googleUser) {
				if (that.googleUser["hg"]) {
					that.token = that.googleUser["hg"].id_token;
					localStorage.setItem("gapi_token", that.token);
					that.promiseResolve();
				}
			} else {
				that.token = null;
			}

			console.log("is signed in: " + that.auth2.isSignedIn.get());
		}
	}
}