require("file?name=camcanvas.swf!./../../../components/jsqrcode-master/src/camcanvas.swf");
import {Component, NgZone} from "angular2/core";

@Component({
    template: require("./scan.component.html"),
	styles: [require("./scan.component.scss")]
})
export class ScanComponent {
	public id: number;
	public firstname: string = "";

	private video: any;
	private canvas: any;
	private constraints = { audio: false, video: true };
	private captureJob: number;
	private scale: number = 0.5;
	private width: number;
	private height: number;

	constructor(private _ngZone: NgZone) { }

	ngAfterViewInit() {
		this.canvas = <any>document.getElementById("qr-canvas");
		(<any>window).qrcode.callback = (value: string) => this.read(value);
	}
	
	private start() {
		this.firstname = "";

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
				},
				(error) => alert("Camera rejected"));
		} else {
			alert("Camara not supported");
		}
	}

	private stop() {
		window.clearInterval(this.captureJob);
		var track = (<any>window).stream.getTracks()[0]; 
		track.stop();
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
		this.stop();
		console.log(value);
		this._ngZone.run(() => { this.firstname = value; });
	}
}