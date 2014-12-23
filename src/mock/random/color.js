/* global define */
/*
    #### Color
*/
define(function() {
	/*
        #### Color

        http://blog.csdn.net/idfaya/article/details/6770414
            颜色空间RGB与HSV(HSL)的转换

        http://llllll.li/randomColor/
            A color generator for JavaScript.
            randomColor generates attractive colors by default. More specifically, randomColor produces bright colors with a reasonably high saturation. This makes randomColor particularly useful for data visualizations and generative art.
        
        http://randomcolour.com/
            var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
            bg_colour = "#" + ("000000" + bg_colour).slice(-6);
            document.bgColor = bg_colour;
        
        http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
            Creating random colors is actually more difficult than it seems. The randomness itself is easy, but aesthetically pleasing randomness is more difficult.
            https://github.com/devongovett/color-generator

        http://www.paulirish.com/2009/random-hex-color-code-snippets/
            Random Hex Color Code Generator in JavaScript

        http://chancejs.com/#color
            chance.color()
            // => '#79c157'
            chance.color({format: 'hex'})
            // => '#d67118'
            chance.color({format: 'shorthex'})
            // => '#60f'
            chance.color({format: 'rgb'})
            // => 'rgb(110,52,164)'

        http://clrs.cc/
            COLORS
            A nicer color palette for the web.
            Navy        #000080     #001F3F
            Blue        #0000ff     #0074D9
            Aqua        #00ffff     #7FDBFF
            Teal        #008080     #39CCCC
            Olive       #008000     #3D9970
            Green       #008000     #2ECC40
            Lime        #00ff00     #01FF70
            Yellow      #ffff00     #FFDC00
            Orange      #ffa500     #FF851B
            Red         #ff0000     #FF4136
            Maroon      #800000     #85144B
            Fuchsia     #ff00ff     #F012BE
            Purple      #800080     #B10DC9
            Silver      #c0c0c0     #DDDDDD
            Gray        #808080     #AAAAAA
            Black       #000000     #111111
            White       #FFFFFF     #FFFFFF

        http://tool.c7sky.com/webcolor
            网页设计常用色彩搭配表

        http://www.colorsontheweb.com/colorwheel.asp
            Color Wheel
        
        https://github.com/One-com/one-color
            An OO-based JavaScript color parser/computation toolkit with support for RGB, HSV, HSL, CMYK, and alpha channels.

        https://github.com/harthur/color
            JavaScript color conversion and manipulation library

        https://github.com/leaverou/css-colors
        http://leaverou.github.io/css-colors/#slategray
            Type a CSS color keyword, #hex, hsl(), rgba(), whatever:

        色调 hue
            http://baike.baidu.com/view/23368.htm
            色调指的是一幅画中画面色彩的总体倾向，是大的色彩效果。
        饱和度 saturation
            http://baike.baidu.com/view/189644.htm
            饱和度是指色彩的鲜艳程度，也称色彩的纯度。饱和度取决于该色中含色成分和消色成分（灰色）的比例。含色成分越大，饱和度越大；消色成分越大，饱和度越小。
        亮度 brightness
            http://baike.baidu.com/view/34773.htm
            亮度是指发光体（反光体）表面发光（反光）强弱的物理量。
        照度 luminosity
            物体被照亮的程度,采用单位面积所接受的光通量来表示,表示单位为勒[克斯](Lux,lx) ,即 1m / m2 。
    */

	// https://github.com/harthur/color-convert/blob/master/conversions.js
	var conversions = {
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
		}
	}
	return {
		colorConversions: conversions,
		/*
		    ##### Random.color()

		    随机生成一个<!--有吸引力的-->颜色，格式为 '#RRGGBB'。

		    * Random.color()
		    * Random.color(format)
		    * Random.color(hue)
		    * Random.color(format, hue)

		    使用示例如下所示：

		        Random.color()
		        // => "#3538B2"
		*/
		color: function() {
			// TODO
			// var formats = 'rgb hsl hsv'.split(' ')
			// var hues = 'navy blue aqua teal olive green lime yellow orange red maroon fuchsia purple silver gray black'.split(' ')
			// [Use ~~ and 0| instead of Math.floor for positive numbers](https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use--and-0-instead-of-mathfloor-for-positive-numbers)
			var color = Math.floor(
				Math.random() *
				(16 * 16 * 16 * 16 * 16 * 16 - 1)
			).toString(16)
			color = "#" + ("000000" + color).slice(-6)
			return color.toUpperCase()
		},
		// http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
		// https://github.com/devongovett/color-generator/blob/master/index.js
		goldenRatioColor: function(saturation, value) {
			this._goldenRatio = 0.618033988749895
			this._hue = this._hue || Math.random()
			this._hue += this._goldenRatio
			this._hue %= 1

			if (typeof saturation !== "number") saturation = 0.5;
			if (typeof value !== "number") value = 0.95;

			var hsv = [
				this._hue * 360,
				saturation * 100,
				value * 100
			]
			var rgb = this.colorConversions.hsv2rgb(hsv)
			return 'rgb(' +
				parseInt(rgb[0], 10) + ', ' +
				parseInt(rgb[1], 10) + ', ' +
				parseInt(rgb[2], 10) + ')'
		}
	}
})