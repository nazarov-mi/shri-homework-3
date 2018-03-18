
import Canvas from './canvas'

class Canvas2D extends Canvas {
	constructor (width, height) {
		super(width, height)

		this._ctx = this._el.getContext('2d')
	}

	clear () {
		this._ctx.clearRect(0, 0, this._width, this._height)
	}

	drawImage (data) {
		this._ctx.drawImage(data, 0, 0, this._width, this._height)
	}

	get ctx () {
		return this._ctx
	}
}

export default Canvas2D