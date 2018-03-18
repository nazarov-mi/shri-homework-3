
export default `
	attribute vec2 a_position;
	varying vec2 v_uv;

	void main() {
		gl_Position = vec4(a_position.x, -a_position.y, 0.0, 1.0);
		v_uv = (a_position + 1.0) * 0.5;
	}
`