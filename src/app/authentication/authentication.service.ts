import {Injectable} from "angular2/core";
import {Headers} from "angular2/http";

@Injectable()
export class AuthenticationService {
	private clientId = "682790434079-ild2uguq4td7h8f5hcqk22str8padhh9.apps.googleusercontent.com";
	private apiKey = "iuGUoOfzdftoufCpBoMIjlom";
	private scopes = "https://www.googleapis.com/auth/userinfo.email";
	private responseTypes = "token id_token";
	private resolveLogin: any;
	private rejectLogin: any;

	public login() {
		// TODO: check if user is already signed in
		var promise = new Promise((resolve, reject) => {
			this.resolveLogin = resolve;
			this.rejectLogin = reject;

			gapi.load("auth2", () => {
				gapi.client.setApiKey(this.apiKey);
				window.setTimeout(this.authorize(true), 1);
			});
		});

		return promise;
	}

	public getToken() {
		var token = <any>gapi.auth.getToken();
		if (token) {
			return token.id_token;
		} else {
			console.log("Could not get token");
			return null;
		}
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