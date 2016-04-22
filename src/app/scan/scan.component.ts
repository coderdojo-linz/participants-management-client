import {Component, NgZone} from "angular2/core";
import {NgClass} from "angular2/common";
import {CDHttpService} from "./../http/cdhttp.service.ts";

@Component({
    template: require("./scan.component.html"),
	styles: [require("./scan.component.scss")],
	providers: [CDHttpService],
	directives: [NgClass]
})
export class ScanComponent {
	public id: number;
	public firstname: string = "";
	public points: number = 0;
	public newCheckin: boolean = false;
	public hasError: boolean = false;

	private video: any;
	private canvas: any;
	private constraints = { audio: false, video: true };
	private captureJob: number;
	private scale: number = 0.5;
	private width: number;
	private height: number;
	private scanRunning: boolean = false;

	constructor(private _ngZone: NgZone, private cdHttpService: CDHttpService) { }

	ngAfterViewInit() {
		this.canvas = <any>document.getElementById("qr-canvas");
		(<any>window).qrcode.callback = (value: string) => this.read(value);

		(<any>$("#welcomeDialog")).on("hidden.bs.modal", (e) => {
			this.scanRunning = false;
		});
	}

	ngOnDestroy() {
		this.stop();
	}

	private toggleScan() {
		if (this.scanRunning) {
			this.stop();
		} else {
			this.start();
		}
	}

	private start() {
		this.firstname = "";
		this.hasError = false;

		var navigator = (<any>window.navigator);
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				this.constraints,
				(localMediaStream) => {
					(<any>window).stream = localMediaStream;
					this.video = <any>document.querySelector("video");
					this.video.src = window.URL.createObjectURL(localMediaStream);

					//this.width = this.video.videoWidth * this.scale;
					//this.height = this.video.videoHeight * this.scale;
					this.width = 320;
					this.height = 240;

					this.canvas.style.width = this.width + "px";
					this.canvas.style.height = this.height + "px";
					this.canvas.width = this.width;
					this.canvas.height = this.height;

					this.captureJob = window.setInterval(() => this.capture(), 1000);
					this._ngZone.run(() => { this.scanRunning = true; });
				},
				(error) => alert("Camera rejected"));
		} else {
			alert("Camara not supported");
		}
	}

	private stop() {
		this.scanRunning = false;
		this.stopStream();
	}

	private stopStream() {
		window.clearInterval(this.captureJob);

		if ((<any>window).stream) {
			var track = (<any>window).stream.getTracks()[0];
			track.stop();
			this.video.src = "";
		}
	}

	private capture() {
		console.log("capture");
		var qr_can = this.canvas.getContext("2d");
		qr_can.drawImage(this.video, 0, 0, this.width, this.height);
		try {
			(<any>window).qrcode.decode();
		}
		catch (err) {
			console.log(err);
		}
	}

	private read(value: string) {
		this._ngZone.run(() => {
			this.stopStream();
			console.log(value);
			var participantId = this.getParameterByName(value, "id");
			//participantId = "570741e31ba1aba3b923ffa5";
			var eventId = "570741f01ba1aba3b923ffe1";

			this.cdHttpService.post("/api/participants/" + participantId + "/checkin/" + eventId,
				"").subscribe(
				data => {
					var result = data.json();

					this.points = result.numberOfCheckins;
					this.newCheckin = result.newCheckin;
					this.firstname = result.givenName;

					var options = {};
					(<any>$("#welcomeDialog")).modal(options);
				},
				error => {
					this.hasError = true;
					console.log(error);
				});
		});
	}

	private getParameterByName(url, name) {
		var match = RegExp("[?&]" + name + "=([^&]*)").exec(url);
		return match && decodeURIComponent(match[1].replace(/\+/g, " "));
	}
}