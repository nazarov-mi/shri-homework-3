
import Canvas from './canvas'

class Canvas3D extends Canvas {
	constructor (width, height) {
		super(width, height)

		this._ctx = this._el.getContext('webgl') || this._el.getContext('experimental-webgl')
	}

	get ctx () {
		return this._ctx
	}
}

export default Canvas3D