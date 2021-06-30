/* eslint-disable no-redeclare*/
/*
    ## Image
*/

import size from './image.json';
import { pick } from './helper.js';
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
        const Canvas = module.require('canvas');
        canvas = new Canvas();
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
