
if (!navigator.getUserMedia) {
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia
}

class Stream {
	constructor (video) {
		this._video = video
		this._data = null
		this._stream = null
		this._audioContext = null
		this._mediaStreamSource = null
		this._analyser = null
		this._scriptProcessor = null
		this._byteFrequencyData = null

		this._init()
	}

	async _init () {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true
			})

			const audioContext = new AudioContext()
			const mediaStreamSource = audioContext.createMediaStreamSource(stream)
			const analyser = audioContext.createAnalyser()
			const scriptProcessor = audioContext.createScriptProcessor()

			analyser.smoothingTimeConstant = 0.7
			analyser.fftSize = 128

			mediaStreamSource.connect(analyser)
			analyser.connect(scriptProcessor)
			scriptProcessor.connect(audioContext.destination)

			this._stream = stream
			this._audioContext = audioContext
			this._mediaStreamSource = mediaStreamSource
			this._analyser = analyser
			this._scriptProcessor = scriptProcessor
			this._byteFrequencyData = new Uint8Array(analyser.frequencyBinCount)

			scriptProcessor.onaudioprocess = d => this._processInput(d)

			this._video.srcObject = stream
		} catch (e) {
			if (e.name === 'ConstraintNotSatisfiedError') {
				console.log(`
					The resolution 
					${constraints.video.width.exact}x${constraints.video.width.exact} px 
					is not supported by your device.
				`)
			} else
			if (e.name === 'PermissionDeniedError') {
				console.log(`
					Permissions have not been granted to use your camera and 
					microphone, you need to allow the page access to your devices in 
					order for the demo to work.
				`)
			}

			console.log(`getUserMedia error: ${e.name}`)
			console.log(e)
		}
	}

	_processInput (audioProcessingEvent) {
		this._analyser.getByteFrequencyData(this._byteFrequencyData)
	}

	get stream () {
		return this._stream
	}

	get audioContext () {
		return this._audioContext
	}

	get byteFrequencyData () {
		return this._byteFrequencyData
	}
}

export default Stream