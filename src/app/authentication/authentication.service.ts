import {Injectable} from "angular2/core";

@Injectable()
export class AuthenticationService {
	private token: string;
	private clientId = "682790434079-ild2uguq4td7h8f5hcqk22str8padhh9.apps.googleusercontent.com";
	private scopes = "profile email";
	private domain = undefined;
	private scriptLoaded: boolean = false;

	constructor() {
		this.token = localStorage.getItem("token");
	}

	public login() {
		var that = this;
		that.loadScript().then((scriptLoaded) => {
			if (scriptLoaded) {
				alert("login");
			}
		});
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
}