
class Canvas {
	constructor (width, height) {
		this._el = document.createElement('canvas')
		this._parent = null
		this._width = null
		this._height = null
		this._ctx = null

		this.resize(width, height)
	}

	resize (width, height) {
		const el = this._el

		el.setAttribute('width', width)
		el.setAttribute('height', height)

		this._width = width
		this._height = height
	}

	mount (parent) {
		if (this._parent) {
			this._parent.removeChild(this._el)
		}

		parent.appendChild(this._el)

		this._parent = parent
	}

	get el () {
		return this._el
	}

	get parent () {
		return this._parent
	}

	get width () {
		return this._width
	}

	get height () {
		return this._height
	}
}

export default Canvas