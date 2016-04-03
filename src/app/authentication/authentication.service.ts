import {Injectable} from "angular2/core";

@Injectable()
export class AuthenticationService {
	private token: string;
	private clientId = "682790434079-ild2uguq4td7h8f5hcqk22str8padhh9.apps.googleusercontent.com";
	private scopes = "profile email";
	private scriptLoaded: boolean = false;
	private auth2: gapi.auth2.GoogleAuth;
	private googleUser: gapi.auth2.GoogleUser;
	private userId: string;
	private userScopes: string;
	private authResponse: gapi.auth2.AuthResponse;
	private signedIn: boolean = false;

	constructor() {
		this.token = localStorage.getItem("token");
	}

	public login() {
		var that = this;
		that.loadScript().then((scriptLoaded) => {
			if (scriptLoaded) {
				window.setTimeout(() => {
					var gapi = (<any>window).gapi;
					if (gapi) {
						gapi.load("auth2", () => that.initAuth2());
					}
				}, 200);
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

	private initAuth2() {
		var that = this;
		that.auth2 = gapi.auth2.init({
			client_id: that.clientId,
			scope: that.scopes
		});

		// Listen for sign-in state changes.
		that.auth2.isSignedIn.listen(() => that.signinChanged);

		// Listen for changes to current user.
		that.auth2.currentUser.listen(() => that.userChanged);

		that.auth2.attachClickHandler(
			document.getElementById("loginButton"),
			{},
			() => that.updateGoogleUser(),
			(error) => alert("error: " + error));

		// Sign in the user if they are currently signed in.
		if (that.auth2.isSignedIn.get() == true) {
			that.auth2.signIn();
		}

		// Start with the current live values.
		that.refreshValues();
	};

	private signinChanged(signedIn: boolean) {
		var that = this;
		that.signedIn = signedIn;
		that.updateGoogleUser();
	}

	private userChanged(user: gapi.auth2.GoogleUser) {
		var that = this;
		that.googleUser = user;
		that.updateGoogleUser();
	}

	private refreshValues() {
		var that = this;
		if (that.auth2) {
			console.log("Refreshing values...");
			that.googleUser = this.auth2.currentUser.get();
			that.updateGoogleUser();
		}
	}

	private updateGoogleUser() {
		var that = this;
		if (that.googleUser) {
			that.userId = that.googleUser.getId();
			that.userScopes = that.googleUser.getGrantedScopes();
			that.authResponse = that.googleUser.getAuthResponse();
		} else {
			that.userId = null;
			that.userScopes = null;
			that.authResponse = null
		}

		console.log(JSON.stringify(that.googleUser, undefined, 2));
		console.log(that.auth2.isSignedIn.get());
	}
}