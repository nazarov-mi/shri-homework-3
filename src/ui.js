
import Canvas2D from './canvas-2d'

function getRandString (len, notation = 10) {
	return Math.random().toString(notation).slice(2, 2 + len)
}

class UI extends Canvas2D {
	constructor (width, height) {
		super(width, height)

		this._analysisRows = []
	}

	_drawMultilineText (x, y, lineHeight, rows) {
		const ctx = this._ctx

		rows.forEach((text, i) => {
			ctx.fillText(text, x, y + lineHeight * i)
		})
	}

	draw (time) {
		const ctx = this._ctx

		ctx.clearRect(0, 0, this._width, this._height)
		ctx.fillStyle = '#fff'
		ctx.font = '16px monospace'

		this._drawMultilineText(40, 40, 20, [
			'ANALYSIS: MATCH:',
			'****************'
		])
		this._drawMultilineText(40, 80, 20, this._analysisRows)

		if (time % 10 === 0) {
			const row = `${getRandString(3)} ${getRandString(5, 36)} ${getRandString(6)}`
			this._analysisRows.unshift(row)

			if (this._analysisRows.length > 10) {
				this._analysisRows.pop()
			}
		}

		ctx.textAlign = 'end'
		ctx.fillText('MISSION: KILL ALL HUMANS', this._width - 20, 40)
		ctx.textAlign = 'start'
	}

	drawRects (rects) {
		const ctx = this._ctx
		const width = this._width
		const height = this._height

		ctx.save()
		ctx.strokeStyle = '#fff'
		ctx.lineWidth = 3

		rects.forEach(rect => {
			const x = rect.x * width
			const y = rect.y * height
			const w = rect.width * width
			const h = rect.height * height

			ctx.strokeRect(x, y, w, h)
			ctx.fillText('MEATBAG DETECTED', x, y - 20)
		})

		ctx.restore()
	}

	drawHistogram (arr) {
		if (!arr || arr.lenght == 0) {
			return
		}

		const ctx = this._ctx
		const width = this._width
		const height = this._height

		ctx.save()
		ctx.strokeStyle = '#fff'
		ctx.lineWidth = 3
		ctx.beginPath()
		ctx.moveTo(40, height - 40 - arr[0])

		arr.forEach((n, i) => {
			ctx.lineTo(40 + i * 10, height - 40 - n)
		})

		ctx.stroke()
		ctx.restore()
	}
}

export default UI