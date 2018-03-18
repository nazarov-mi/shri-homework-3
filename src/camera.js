
import Canvas2D from './canvas-2d'

require('tracking/build/tracking-min.js')
require('tracking/build/data/face-min.js')

class Camera extends Canvas2D {
	constructor (width, height) {
		super(width, height)

		this._video = this._createVideo()
		this._bars = []
		this._rects = []
		this._initStream()
	}

	_createVideo () {
		const video = document.createElement('video')
		document.body.prepend(video)

		video.style.position = 'fixed'
		video.style.transform = 'translate(-100%, -100%)'
		video.setAttribute('preload', true)
		video.setAttribute('autoplay', true)
		video.setAttribute('loop', true)
		video.setAttribute('muted', true)
		video.setAttribute('width', 320)
		video.setAttribute('height', 240)

		return video
	}

	async _initStream () {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true, // need true
				video: true	
			})

			console.log(stream.getVideoTracks())

			this._video.srcObject = stream

			// Handle the incoming audio stream
			const bars = this._bars // We'll use this later
			const audioContext = new AudioContext();
			const input = audioContext.createMediaStreamSource(stream);
			const analyser = audioContext.createAnalyser();
			const scriptProcessor = audioContext.createScriptProcessor();

			// Some analyser setup
			analyser.smoothingTimeConstant = 0.3;
			analyser.fftSize = 1024;

			input.connect(analyser);
			analyser.connect(scriptProcessor);
			scriptProcessor.connect(audioContext.destination);

			const processInput = audioProcessingEvent => {
				const tempArray = new Uint8Array(analyser.frequencyBinCount);

				analyser.getByteFrequencyData(tempArray);
				bars.push(getAverageVolume(tempArray));

				if (bars.length > 50) {
					bars.shift()
				}
			}

			const getAverageVolume = array => {
				const length = array.length;
				let values = 0;
				let i = 0;

				for (; i < length; i++) {
				  values += array[i];
				}

				return values / length;
			}

			scriptProcessor.onaudioprocess = processInput;

			const tracker = new tracking.ObjectTracker('face')
			tracker.setInitialScale(4)
			tracker.setStepSize(2)
			tracker.setEdgesDensity(0.1)
			tracking.track(this._video, tracker, { camera: true })

			tracker.on('track', (event) => {
				this._rects = event.data
			})
		} catch (e) {
			if (error.name === 'ConstraintNotSatisfiedError') {
				console.log(`
					The resolution 
					${constraints.video.width.exact}x${constraints.video.width.exact} px 
					is not supported by your device.
				`)
			} else
			if (error.name === 'PermissionDeniedError') {
				console.log(`
					Permissions have not been granted to use your camera and 
					microphone, you need to allow the page access to your devices in 
					order for the demo to work.
				`)
			}

			console.log(`getUserMedia error: ${error.name}`)
			console.log(error)
		}
	}

	resize (width, height) {
		super.resize(width, height)

		const video = this._video

		if (video) {
			video.setAttribute('width', width)
			video.setAttribute('height', height)
		}
	}

	draw (uictx) {
		const video = this._video

		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			try {
				this._ctx.drawImage(video, 0, 0, this._width, this._height)

				const bars = this._bars
				const ctx = uictx
				ctx.strokeStyle = '#fff'
				ctx.fillStyle = '#fff'
				ctx.lineWidth = 3
				ctx.font = '24px monospace'

				ctx.beginPath()
				ctx.moveTo(40, this._height - 40 - bars[0])

				for (let i = 1; i < bars.length; ++ i) {
					ctx.lineTo(40 + i * 10, this._height - 40 - bars[i])
				}

				ctx.stroke()

				this._rects.forEach(rect => {
					const sx = this._width / 320
					const sy = this._height / 240
					ctx.strokeRect(rect.x * sx, rect.y * sy, rect.width * sx, rect.height * sy)
					ctx.fillText('HUMAN DETECTED', rect.x * sx, rect.y * sy - 20)
				})
			} catch (e) {
				console.log(e)
			}
		}
	}
	
	get video () {
		return this._video
	}
}

export default Camera