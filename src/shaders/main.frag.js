
export default `
	precision highp float;
	uniform sampler2D u_textureA;
	uniform sampler2D u_textureB;
	uniform float u_time;
	uniform vec2 u_resolution;
	varying vec2 v_uv;

	#define M_PI 3.1415926535897932384626433832795

	vec4 getMainColor (sampler2D texture, vec2 uv) {
		// Получение цвета
		vec4 color = texture2D(texture, uv);

		// Наложение полос
		color.rgb += sin(uv.y * u_resolution.y) * 0.05;

		// Наложение крассного цвета
		float red = clamp(color.r * 2.0 - 0.5, 0.0, 1.0);
		color.rgba = vec4(red, 0.2, 0.3, 1.0);

		return color;
	}

	vec4 getUIColor (sampler2D texture, vec2 uv) {
		float time = sin(u_time) * 3.0;

		// Получение цвета
		vec4 color = texture2D(texture, uv);

		// Получение зелёного канала
		color.g = texture2D(texture, uv + vec2(time / u_resolution.x, 0.0)).g;

		// Получение синего канала
		color.b = texture2D(texture, uv + vec2(0.0, time / u_resolution.y)).b;

		return color;
	}

	// Получение остатка от деления
	float fraction (float a, float b) {
		return ((a / b) - floor(a / b)) * b;
	}

	// Функция таймера
	float timer (float delay, float duration) {
		return min(fraction(u_time, delay + duration), duration);
	}

	// Функция для сдвига uv координат для пиксилизации

	#define PIXELATE_DELAY 700.0
	#define PIXELATE_DURATION 30.0

	vec2 pixelate (vec2 uv) {
		float time = timer(PIXELATE_DELAY, PIXELATE_DURATION) / PIXELATE_DURATION;
		time = 1.0 - abs(sin(time * M_PI));
		vec2 size = u_resolution * time;

		return floor(uv * size) / size;
	}

	// Функция для смещения uv координат для создания шума

	#define NOISE_DELAY 300.0
	#define NOISE_DURATION 80.0

	vec2 noise (vec2 uv) {
		float time = NOISE_DURATION - timer(NOISE_DELAY, NOISE_DURATION);
		vec2 offset = uv * u_resolution;

		offset.x += floor(sin(offset.y / 5.0 * time + time * time)) * 0.5 * time;

		return offset / u_resolution;
	}

	void main () {
		vec2 uv = v_uv;

		uv = noise(uv);
		uv = pixelate(uv);

		vec4 colorA = getMainColor(u_textureA, uv);
		vec4 colorB = getUIColor(u_textureB, uv);

		vec4 color = mix(colorA, colorB, 0.5);

		// Выход
		gl_FragColor = color;
	}
`