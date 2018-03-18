
import Canvas from './canvas'

class Canvas2D extends Canvas {
	constructor (width, height) {
		super(width, height)

		this._ctx = this._el.getContext('2d')
	}

	get ctx () {
		return this._ctx
	}
}

export default Canvas2D