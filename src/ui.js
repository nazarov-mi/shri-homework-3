
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
		ctx.font = '14px monospace'
		ctx.fillStyle = '#fff'
		ctx.strokeStyle = '#fff'
		ctx.lineWidth = 2

		ctx.save()
		ctx.translate(20, 20)

		this._drawMultilineText(0, 0, 14, [
			'ANALYSIS: MATCH:',
			'****************'
		])
		this._drawMultilineText(0, 28, 20, this._analysisRows)

		if (time % 10 === 0) {
			const row = `${getRandString(3)} ${getRandString(5, 36)} ${getRandString(6)}`
			this._analysisRows.unshift(row)

			if (this._analysisRows.length > 10) {
				this._analysisRows.pop()
			}
		}

		ctx.textAlign = 'end'
		ctx.fillText('MISSION: KILL ALL HUMANS', this._width - 40, 0)
		ctx.textAlign = 'start'

		ctx.restore()
	}

	drawRects (rects) {
		const ctx = this._ctx
		const width = this._width
		const height = this._height

		ctx.save()

		rects.forEach(rect => {
			const x = rect.x * width
			const y = rect.y * height
			const w = rect.width * width
			const h = rect.height * height

			ctx.strokeRect(x, y, w, h)
			ctx.fillText('MEATBAG DETECTED', x, y - 14)
		})

		ctx.restore()
	}

	drawHistogram (arr) {
		if (!arr || arr.length === 0) {
			return
		}

		const ctx = this._ctx
		const width = this._width
		const height = this._height
		const scaleX = width * 0.5 / arr.length
		const scaleY = height * .3 * (1 / 255)

		ctx.save()
		ctx.translate(20, height - 20)
		ctx.scale(scaleX, -scaleY)
		ctx.beginPath()
		ctx.moveTo(0, arr[0])

		arr.forEach((n, i) => {
			ctx.lineTo(i, n)
		})

		ctx.stroke()
		ctx.restore()
	}
}

export default UI