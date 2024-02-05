/* eslint-disable no-redeclare*/
/*
    ## Image
*/

import size from './image.json';
import { pick } from './helper';
const { _adSize, _screenSize, _videoSize } = size;

/*
    BrandColors
    http://brandcolors.net/
    A collection of major brand color codes curated by Galen Gidman.
    大牌公司的颜色集合

    // 获取品牌和颜色
    $('h2').each(function(index, item){
        item = $(item)
        console.log('\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
    })
*/
import _brandColors from './brandColors.json';
import { hex } from './color';
const _brandNames = Object.keys(_brandColors);

/*
    生成一个随机的图片地址。

    使用 api 替代图片源
        http://fpoimg.com/
    参考自
        http://rensanning.iteye.com/blog/1933310
        http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
*/
function image(...args) {
    let size;
    let background;
    let foreground;
    let format;
    let text;
    switch (arguments.length) {
        case 4:
            [size, background, foreground, text] = args;
            break;
        case 3:
            [size, background, text] = args;
            break;
        default:
            [size, background, foreground, format, text] = args;
    }

    // Random.image()
    if (!size) size = pick(_adSize);

    // 去除前面的 # 号
    foreground = (foreground || hex()).replace(/^#/, '');
    background = (background || hex()).replace(/^#/, '');

    // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
    return `http://dummyimage.com/${size}${background ? '/' + background : ''}${foreground ? '/' + foreground : ''}${
        format ? '.' + format : ''
    }${text ? '&text=' + text : ''}`;
}
/*
    生成一段随机的 Base64 图片编码。

    https://github.com/imsky/holder
    Holder renders image placeholders entirely on the client side.

    dataImageHolder: function(size) {
        return 'holder.js/' + size
    },
*/
function dataImage(size, text) {
    let canvas;
    if (typeof document !== 'undefined') {
        canvas = document.createElement('canvas');
    } else {
        /*
            https://github.com/Automattic/node-canvas
                npm install canvas --save
            安装问题：
            * http://stackoverflow.com/questions/22953206/gulp-issues-with-cario-install-command-not-found-when-trying-to-installing-canva
            * https://github.com/Automattic/node-canvas/issues/415
            * https://github.com/Automattic/node-canvas/wiki/_pages

            PS：node-canvas 的安装过程实在是太繁琐了，所以不放入 package.json 的 dependencies。
         */
        return 'data:image/png;base64,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didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgWENDgwzM6AQK9AgLa6293AgSCBQQ0+PCMToBAr4CA9vrbnQCBYAEBDT48oxMg0CsgoL3+didAIFhAQIMPz+gECPQKCGivv90JEAgW+B//a1ZE6945QgAAAABJRU5ErkJggg==';
    }

    const ctx = canvas && canvas.getContext && canvas.getContext('2d');
    if (!canvas || !ctx) return '';

    if (!size) size = pick(_adSize);
    text = text !== undefined ? text : size;

    size = size.split('x');

    const width = parseInt(size[0], 10);
    const height = parseInt(size[1], 10);
    const background = _brandColors[pick(_brandNames)];
    const foreground = '#FFF';
    const textHeight = 14;
    const font = 'sans-serif';

    canvas.width = width;
    canvas.height = height;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = foreground;
    ctx.font = 'bold ' + textHeight + 'px ' + font;
    ctx.fillText(text, width / 2, height / 2, width);
    return canvas.toDataURL('image/png');
}
export { _adSize, _screenSize, _videoSize, image, image as img, _brandColors, _brandNames, dataImage };
