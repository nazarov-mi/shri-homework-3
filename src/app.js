
import UI from './ui'
import Canvas2D from './canvas-2d'
import Canvas3D from './canvas-3d'
import Stream from './stream'
import Texture from './webgl/texture'
import Shader from './webgl/shader'
import mainVertShader from './shaders/main.vert'
import mainFragShader from './shaders/main.frag'

require('tracking/build/tracking-min.js')
require('tracking/build/data/face-min.js')

class App {
	constructor (parent) {
		this._parent = parent

		this._time = 0
		this._tracker = null
		this._track = null
		this._facesRects = []
		this._smEdge = 320
		this._mdEdge = 800

		this._aspectRatio = 1
		this._width = 0
		this._height = 0
		this._mdWidth = 0
		this._mdHeight = 0
		this._smWidth = 0
		this._smHeight = 0

		this._calcSizes()

		this._video = this._createVideo()
		this._videoCanvas = new Canvas2D(this._smWidth, this._smHeight)
		this._videoPlaying = false
		this._videoTimeupdate = false

		this._ui = new UI(this._mdWidth, this._mdHeight)
		this._canvas = new Canvas3D(this._mdWidth, this._mdHeight)
		this._buffer = this._createBuffer() 
		this._stream = new Stream(this._video)

		this._mainTexture = this.createTexture()
		this._uiTexture = this.createTexture()
		this._shader = this.createShader(mainVertShader, mainFragShader)

		this._canvas.mount(parent)

		this._initTraker()

		window.addEventListener('resize', () => {
			this.resize()
		})

		this.start()
	}

	_createBuffer () {
		const gl = this._canvas.ctx
		const buffer = gl.createBuffer()

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1, -1,
			 1, -1,
			-1,  1,
			-1,  1,
			 1, -1,
			 1,  1
		]), gl.STATIC_DRAW)

		return buffer
	}

	_createVideo () {
		const video = document.createElement('video')

		video.setAttribute('preload', 'auto')
		video.setAttribute('autoplay', true)
		video.setAttribute('loop', true)
		video.setAttribute('muted', true)

		video.addEventListener('playing', () => {
			this._videoPlaying = true
		}, true)

		video.addEventListener('timeupdate', () => {
			this._videoTimeupdate = true
		}, true)

		video.play()

		return video
	}

	_initTraker () {
		const invWidth = 1 / this._smWidth
		const invHeight = 1 / this._smHeight
		const tracker = new tracking.ObjectTracker('face')

		tracker.setInitialScale(4)
		tracker.setStepSize(2)
		tracker.setEdgesDensity(0.1)

		const track = tracking.track(this._videoCanvas.el, tracker)

		tracker.on('track', (event) => {
			this._facesRects = event.data.map((rect) => {
				rect.x *= invWidth
				rect.y *= invHeight
				rect.width *= invWidth
				rect.height *= invHeight

				return rect
			})
		})

		this._tracker = tracker
		this._track = track
	}

	_calcSizes () {
		const smEdge = this._smEdge
		const mdEdge = this._mdEdge
		const width = window.innerWidth
		const height = window.innerHeight
		const aspectRatio = width / height
		let mdWidth, mdHeight, smWidth, smHeight

		if (aspectRatio >= 1) {
			mdWidth = Math.min(width, mdEdge)
			mdHeight = mdWidth / aspectRatio
			smWidth = Math.min(width, smEdge)
			smHeight = smWidth / aspectRatio
		} else {
			mdHeight = Math.min(height, mdEdge)
			mdWidth = mdHeight * aspectRatio
			smHeight = Math.min(height, smEdge)
			smWidth = smHeight * aspectRatio
		}

		this._aspectRatio = aspectRatio
		this._width = width
		this._height = height
		this._mdWidth = mdWidth
		this._mdHeight = mdHeight
		this._smWidth = smWidth
		this._smHeight = smHeight
	}

	resize () {
		this._calcSizes()

		this._canvas.resize(this._mdWidth, this._mdHeight)
		this._videoCanvas.resize(this._smWidth, this._smHeight)
		this._ui.resize(this._mdWidth, this._mdHeight)
	}

	clear (width, height) {
		const gl = this._canvas.ctx

		gl.viewport(0, 0, width, height)
		gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.COLOR_BUFFER_BIT)
	}

	flush () {
		const gl = this._canvas.ctx

		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
		gl.flush()
	}

	start () {
		this.tick()
	}

	tick () {
		const time = this._time
		const video = this._video

		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			try {
				this._videoCanvas.drawImage(video)
			} catch (e) {}
		}

		if (this._time % 4 === 0) {
			this._track.setRunning(false)
			this._track.run()
		}

		this._ui.draw(time)
		this._ui.drawRects(this._facesRects)
		this._ui.drawHistogram(this._stream.byteFrequencyData)

		this.draw(time)

		this._time += 1

		requestAnimationFrame(() => this.tick())
	}

	draw () {
		const width = this._mdWidth
		const height = this._mdHeight
		const shader = this._shader
		const textureA = this._mainTexture
		const textureB = this._uiTexture

		this.clear(width, height)

		shader.bind()

		if (this._videoPlaying && this._videoTimeupdate) {
			textureA.setImage(this._video)
		}

		textureB.setImage(this._ui.el)

		shader.bindUniform('1f', 'u_time', this._time)
		shader.bindUniform('2f', 'u_resolution', width, height)
		shader.bindUniform('1i', 'u_textureA', textureA.bind(0))
		shader.bindUniform('1i', 'u_textureB', textureB.bind(1))

		this.flush()
	}

	createTexture () {
		return new Texture(this._canvas.ctx)
	}

	createShader (vert, frag) {
		return new Shader(this._canvas.ctx, vert, frag)
	}
}

window.DEBUG = true
window.__app = new App(document.body)
