import { Component, OnInit, NgZone } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from "rxjs/Observable";
import { DataService, CoderDojoEvent } from './../data/data.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
  public id: number;
  public firstname: string = "";
  public points: number = 0;
  public newCheckin: boolean = false;
  public hasError: boolean = false;
  public events: any[] = [];
  public selectedEvent: string;

  private video: any;
  private canvas: any;
  private constraints = { audio: false, video: true };
  private captureJob: number;
  private scale: number = 0.5;
  private width: number;
  private height: number;
  private scanRunning: boolean = false;

  constructor(private authHttp: AuthHttp, private dataService: DataService, private _ngZone: NgZone) { }

  ngOnInit() {
    this.loadEvents();
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

					this.width = this.video.videoWidth * this.scale;
					this.height = this.video.videoHeight * this.scale;
					this.width = 320;
					this.height = 240;

					// this.canvas.style.width = this.width + "px";
					// this.canvas.style.height = this.height + "px";
					// this.canvas.width = this.width;
					// this.canvas.height = this.height;

					//this.captureJob = window.setInterval(() => this.capture(), 1000);
					this._ngZone.run(() => { this.scanRunning = true; });
				},
				(error) => console.log("Camera rejected"));
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
		var qr_can = this.canvas.getContext("2d");
		qr_can.drawImage(this.video, 0, 0, this.width, this.height);
		try {
			(<any>window).qrcode.decode();
		}
		catch (err) {
			console.log(err);
		}

		if (!(<any>window).stream.active && this.scanRunning) {
			this.stop();
			this.start();
		}
	}

	private read(value: string) {
		this._ngZone.run(() => {
			this.stopStream();
			console.log(value);
			var participantId = this.getParameterByName(value, "id");
			var eventId = this.selectedEvent;

			this.authHttp.post("/api/participants/" + participantId + "/checkin/" + eventId,
				"").subscribe(
				data => {
					var result = data.json();

					this.points = result.numberOfCheckins;
					this.newCheckin = result.newCheckin;
					this.firstname = result.givenName;

					this.stop();
					var options = {};
					//(<any>$("#welcomeDialog")).modal(options);
				},
				error => {
					this.hasError = true;
					console.log(error);
					//this.stop();
					//this.start();
				});
		});
	}

	private getParameterByName(url: string, name: string) {
		if (url.indexOf("?") >= 0 || url.indexOf("&") >= 0) {
			var match = RegExp("[?&]" + name + "=([^&]*)").exec(url);
			return match && decodeURIComponent(match[1].replace(/\+/g, " "));
		} else {
			return url;
		}
	}

  private loadEvents() {
    this.dataService.getEvents()
      .subscribe(
      data => this.events = data,
      error => console.log("error: " + error._body || error),
      () => {
        this.selectedEvent = this.events.filter((event: any) => (new Date(event.date)).setHours(0, 0, 0, 0) >= (new Date()).setHours(0, 0, 0, 0))[0]._id; 
      });
  }
}
