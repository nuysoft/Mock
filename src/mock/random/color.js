/* global define */
/*
    ## Color

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

    http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
		var letters = '0123456789ABCDEF'.split('')
		var color = '#'
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)]
		}
		return color
	
		// 随机生成一个无脑的颜色，格式为 '#RRGGBB'。
		// _brainlessColor()
		var color = Math.floor(
			Math.random() *
			(16 * 16 * 16 * 16 * 16 * 16 - 1)
		).toString(16)
		color = "#" + ("000000" + color).slice(-6)
		return color.toUpperCase()
*/
define(['./color-convert'], function(Convert) {
	return {
		// 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
		color: function() {
			return this.hex()
		},
		// #DAC0DE
		hex: function() {
			var hsv = this._goldenRatioColor()
			var rgb = Convert.hsv2rgb(hsv)
			var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2])
			return hex
		},
		// rgb(128,255,255)
		rgb: function() {
			var hsv = this._goldenRatioColor()
			var rgb = Convert.hsv2rgb(hsv)
			return 'rgb(' +
				parseInt(rgb[0], 10) + ', ' +
				parseInt(rgb[1], 10) + ', ' +
				parseInt(rgb[2], 10) + ')'
		},
		// hsl(300,80%,90%)
		hsl: function() {
			var hsv = this._goldenRatioColor()
			var hsl = Convert.hsv2hsl(hsv)
			return 'hsl(' +
				parseInt(hsl[0], 10) + ', ' +
				parseInt(hsl[1], 10) + ', ' +
				parseInt(hsl[2], 10) + ')'
		},
		// http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
		// https://github.com/devongovett/color-generator/blob/master/index.js
		// 随机生成一个有吸引力的颜色。
		_goldenRatioColor: function(saturation, value) {
			this._goldenRatio = 0.618033988749895
			this._hue = this._hue || Math.random()
			this._hue += this._goldenRatio
			this._hue %= 1

			if (typeof saturation !== "number") saturation = 0.5;
			if (typeof value !== "number") value = 0.95;

			return [
				this._hue * 360,
				saturation * 100,
				value * 100
			]
		}
	}
})