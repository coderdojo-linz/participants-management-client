import {Component, NgZone} from "@angular/core";
import {NgClass} from "@angular/common";
import {Http, HttpModule} from "@angular/http";
import {CDHttpService} from "./../http/cdhttp.service.ts";
import {DataService, CoderDojoEvent} from "./../data/data.service.ts";

@Component({
    template: require("./scan.component.html"),
	styles: [require("./scan.component.scss")],
	providers: [CDHttpService, DataService]
})
export class ScanComponent {
	public id: number;
	public firstname: string = "";
	public points: number = 0;
	public newCheckin: boolean = false;
	public hasError: boolean = false;
	public events: CoderDojoEvent[] = [];
	public selectedEvent: string;

	private video: any;
	private canvas: any;
	private constraints = { audio: false, video: true };
	private captureJob: number;
	private scale: number = 0.5;
	private width: number;
	private height: number;
	private scanRunning: boolean = false;

	constructor(private _ngZone: NgZone, private dataService: DataService, private cdHttpService: CDHttpService) {
		this.loadEvents();
	}

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
					this.video.play();

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
			(<any>window).stream.getTracks().forEach(track => {
				track.stop();
			});
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
			var eventId = this.selectedEvent;

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
					this.stop();
					this.start();
				});
		});
	}

	private getParameterByName(url, name) {
		var match = RegExp("[?&]" + name + "=([^&]*)").exec(url);
		return match && decodeURIComponent(match[1].replace(/\+/g, " "));
	}

	private loadEvents() {
		this.dataService.getEvents()
			.subscribe(data => this.events = data,
			error => console.error(error),
			() => {
				this.selectedEvent = this.events.filter((event: CoderDojoEvent) => (new Date(event.date)).setHours(0, 0, 0, 0) >= (new Date()).setHours(0, 0, 0, 0))[0]._id;
			});
	}
}