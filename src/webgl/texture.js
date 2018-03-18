
import WebGLApi from './webgl-api'

class Texture extends WebGLApi {
	constructor (gl) {
		super(gl)

		this._data = null

		this._init()
	}
	
	_init () {
		const gl = this._gl

		const texture = gl.createTexture()

		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		this._data = texture
	}

	bind (unit = null) {
		const gl = this._gl

		if (unit !== null) {
			gl.activeTexture(gl.TEXTURE0 + unit)
		}

		gl.bindTexture(gl.TEXTURE_2D, this._data)

		return unit
	}

	setImage (value) {
		const gl = this._gl

		gl.bindTexture(gl.TEXTURE_2D, this._data)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, value)
	}

	get data () {
		return this._data
	}
}

export default Texture