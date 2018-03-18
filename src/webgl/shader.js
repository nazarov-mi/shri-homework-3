
import WebGLApi from './webgl-api'

class Shader extends WebGLApi {
	constructor (gl, vert, frag) {
		super(gl)

		this._vertSrc = vert
		this._fragSrc = frag

		this._data = null
		this._uniforms = {}

		this._init()
	}

	_init () {
		const gl = this._gl
		const vertex = gl.createShader(gl.VERTEX_SHADER)

		gl.shaderSource(vertex, this._vertSrc)
		gl.compileShader(vertex)

		if (window.DEBUG && !gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(vertex)
		}

		const fragment = gl.createShader(gl.FRAGMENT_SHADER)

		gl.shaderSource(fragment, this._fragSrc)
		gl.compileShader(fragment)

		if (window.DEBUG && !gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(fragment)
		}

		const program = gl.createProgram()

		gl.attachShader(program, vertex)
		gl.attachShader(program, fragment)
		gl.linkProgram(program)

		if (window.DEBUG && !gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw gl.getProgramInfoLog(program)
		}

		gl.useProgram(program)

		const p = gl.getAttribLocation(program, 'a_position')

		gl.enableVertexAttribArray(p)
		gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0)

		this._data = program
	}

	bind () {
		this._gl.useProgram(this._data)
	}

	getUniformLocation (name) {
		const uniforms = this._uniforms

		if (!uniforms[name]) {
			uniforms[name] = this._gl.getUniformLocation(this._data, name)
		}

		return uniforms[name]
	}

	get data () {
		return this._data
	}
}

export default Shader