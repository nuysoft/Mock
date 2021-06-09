/*
    ## Color Convert

    http://blog.csdn.net/idfaya/article/details/6770414
        颜色空间RGB与HSV(HSL)的转换
*/
// https://github.com/harthur/color-convert/blob/master/conversions.js
module.exports = {
	rgb2hsl: function rgb2hsl(rgb) {
		var r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255,
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, l;

		if (max == min)
			h = 0;
		else if (r == max)
			h = (g - b) / delta;
		else if (g == max)
			h = 2 + (b - r) / delta;
		else if (b == max)
			h = 4 + (r - g) / delta;

		h = Math.min(h * 60, 360);

		if (h < 0)
			h += 360;

		l = (min + max) / 2;

		if (max == min)
			s = 0;
		else if (l <= 0.5)
			s = delta / (max + min);
		else
			s = delta / (2 - max - min);

		return [h, s * 100, l * 100];
	},
	rgb2hsv: function rgb2hsv(rgb) {
		var r = rgb[0],
			g = rgb[1],
			b = rgb[2],
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, v;

		if (max === 0)
			s = 0;
		else
			s = (delta / max * 1000) / 10;

		if (max == min)
			h = 0;
		else if (r == max)
			h = (g - b) / delta;
		else if (g == max)
			h = 2 + (b - r) / delta;
		else if (b == max)
			h = 4 + (r - g) / delta;

		h = Math.min(h * 60, 360);

		if (h < 0)
			h += 360;

		v = ((max / 255) * 1000) / 10;

		return [h, s, v];
	},
	hsl2rgb: function hsl2rgb(hsl) {
		var h = hsl[0] / 360,
			s = hsl[1] / 100,
			l = hsl[2] / 100,
			t1, t2, t3, rgb, val;

		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}

		if (l < 0.5)
			t2 = l * (1 + s);
		else
			t2 = l + s - l * s;
		t1 = 2 * l - t2;

		rgb = [0, 0, 0];
		for (var i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * -(i - 1);
			if (t3 < 0) t3++;
			if (t3 > 1) t3--;

			if (6 * t3 < 1)
				val = t1 + (t2 - t1) * 6 * t3;
			else if (2 * t3 < 1)
				val = t2;
			else if (3 * t3 < 2)
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			else
				val = t1;

			rgb[i] = val * 255;
		}

		return rgb;
	},
	hsl2hsv: function hsl2hsv(hsl) {
		var h = hsl[0],
			s = hsl[1] / 100,
			l = hsl[2] / 100,
			sv, v;
		l *= 2;
		s *= (l <= 1) ? l : 2 - l;
		v = (l + s) / 2;
		sv = (2 * s) / (l + s);
		return [h, sv * 100, v * 100];
	},
	hsv2rgb: function hsv2rgb(hsv) {
		var h = hsv[0] / 60
		var s = hsv[1] / 100
		var v = hsv[2] / 100
		var hi = Math.floor(h) % 6

		var f = h - Math.floor(h)
		var p = 255 * v * (1 - s)
		var q = 255 * v * (1 - (s * f))
		var t = 255 * v * (1 - (s * (1 - f)))

		v = 255 * v

		switch (hi) {
			case 0:
				return [v, t, p]
			case 1:
				return [q, v, p]
			case 2:
				return [p, v, t]
			case 3:
				return [p, q, v]
			case 4:
				return [t, p, v]
			case 5:
				return [v, p, q]
		}
	},
	hsv2hsl: function hsv2hsl(hsv) {
		var h = hsv[0],
			s = hsv[1] / 100,
			v = hsv[2] / 100,
			sl, l;

		l = (2 - s) * v;
		sl = s * v;
		sl /= (l <= 1) ? l : 2 - l;
		l /= 2;
		return [h, sl * 100, l * 100];
	},
	// http://www.140byt.es/keywords/color
	rgb2hex: function(
		a, // red, as a number from 0 to 255
		b, // green, as a number from 0 to 255
		c // blue, as a number from 0 to 255
	) {
		return "#" + ((256 + a << 8 | b) << 8 | c).toString(16).slice(1)
	},
	hex2rgb: function(
		a // take a "#xxxxxx" hex string,
	) {
		a = '0x' + a.slice(1).replace(a.length > 4 ? a : /./g, '$&$&') | 0;
		return [a >> 16, a >> 8 & 255, a & 255]
	}
}