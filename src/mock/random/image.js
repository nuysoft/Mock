/* global define, document */
/*
    #### Image
*/
define(function() {
    return {
        ad_size: [
            '300x250', '250x250', '240x400', '336x280', '180x150',
            '720x300', '468x60', '234x60', '88x31', '120x90',
            '120x60', '120x240', '125x125', '728x90', '160x600',
            '120x600', '300x600'
        ],
        screen_size: [
            '320x200', '320x240', '640x480', '800x480', '800x480',
            '1024x600', '1024x768', '1280x800', '1440x900', '1920x1200',
            '2560x1600'
        ],
        video_size: ['720x480', '768x576', '1280x720', '1920x1080'],
        /*
            ##### Random.img(size, background, foreground, format, text)

            * Random.img()
            * Random.img(size)
            * Random.img(size, background)
            * Random.img(size, background, text)
            * Random.img(size, background, foreground, text)
            * Random.img(size, background, foreground, format, text)

            生成一个随机的图片地址。

            **参数的含义和默认值**如下所示：

            * 参数 size：可选。指示图片的宽高，格式为 `'宽x高'`。默认从下面的数组中随机读取一个：

                    [
                        '300x250', '250x250', '240x400', '336x280', 
                        '180x150', '720x300', '468x60', '234x60', 
                        '88x31', '120x90', '120x60', '120x240', 
                        '125x125', '728x90', '160x600', '120x600', 
                        '300x600'
                    ]

            * 参数 background：可选。指示图片的背景色。默认值为 '#000000'。
            * 参数 foreground：可选。指示图片的前景色（文件）。默认值为 '#FFFFFF'。
            * 参数 format：可选。指示图片的格式。默认值为 'png'，可选值包括：'png'、'gif'、'jpg'。
            * 参数 text：可选。指示图片上文字。默认为 ''。

            **使用示例**如下所示：
                
                Random.img()
                // => "http://dummyimage.com/125x125"
                Random.img('200x100')
                // => "http://dummyimage.com/200x100"
                Random.img('200x100', '#fb0a2a')
                // => "http://dummyimage.com/200x100/fb0a2a"
                Random.img('200x100', '#02adea', 'hello')
                // => "http://dummyimage.com/200x100/02adea&text=hello"
                Random.img('200x100', '#00405d', '#FFF', 'mock')
                // => "http://dummyimage.com/200x100/00405d/FFF&text=mock"
                Random.img('200x100', '#ffcc33', '#FFF', 'png', 'js')
                // => "http://dummyimage.com/200x100/ffcc33/FFF.png&text=js"

            生成的路径所对应的图片如下所示：

            ![](http://dummyimage.com/125x125)
            ![](http://dummyimage.com/200x100)
            ![](http://dummyimage.com/200x100/fb0a2a)
            ![](http://dummyimage.com/200x100/02adea&text=hello)
            ![](http://dummyimage.com/200x100/00405d/FFF&text=mock)
            ![](http://dummyimage.com/200x100/ffcc33/FFF.png&text=js)

            替代图片源
                http://fpoimg.com/
            参考自 
                http://rensanning.iteye.com/blog/1933310
                http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
            
        */
        image: function(size, background, foreground, format, text) {
            if (arguments.length === 4) {
                text = format
                format = undefined
            }
            if (arguments.length === 3) {
                text = foreground
                foreground = undefined
            }
            if (!size) size = this.pick(this.ad_size)

            if (background && ~background.indexOf('#')) background = background.slice(1)
            if (foreground && ~foreground.indexOf('#')) foreground = foreground.slice(1)

            // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
            return 'http://dummyimage.com/' + size +
                (background ? '/' + background : '') +
                (foreground ? '/' + foreground : '') +
                (format ? '.' + format : '') +
                (text ? '&text=' + text : '')
        },
        img: function() {
            return this.image.apply(this, arguments)
        },

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
        brandColors: {
            '4ormat': '#fb0a2a',
            '500px': '#02adea',
            'About.me (blue)': '#00405d',
            'About.me (yellow)': '#ffcc33',
            'Addvocate': '#ff6138',
            'Adobe': '#ff0000',
            'Aim': '#fcd20b',
            'Amazon': '#e47911',
            'Android': '#a4c639',
            'Angie\'s List': '#7fbb00',
            'AOL': '#0060a3',
            'Atlassian': '#003366',
            'Behance': '#053eff',
            'Big Cartel': '#97b538',
            'bitly': '#ee6123',
            'Blogger': '#fc4f08',
            'Boeing': '#0039a6',
            'Booking.com': '#003580',
            'Carbonmade': '#613854',
            'Cheddar': '#ff7243',
            'Code School': '#3d4944',
            'Delicious': '#205cc0',
            'Dell': '#3287c1',
            'Designmoo': '#e54a4f',
            'Deviantart': '#4e6252',
            'Designer News': '#2d72da',
            'Devour': '#fd0001',
            'DEWALT': '#febd17',
            'Disqus (blue)': '#59a3fc',
            'Disqus (orange)': '#db7132',
            'Dribbble': '#ea4c89',
            'Dropbox': '#3d9ae8',
            'Drupal': '#0c76ab',
            'Dunked': '#2a323a',
            'eBay': '#89c507',
            'Ember': '#f05e1b',
            'Engadget': '#00bdf6',
            'Envato': '#528036',
            'Etsy': '#eb6d20',
            'Evernote': '#5ba525',
            'Fab.com': '#dd0017',
            'Facebook': '#3b5998',
            'Firefox': '#e66000',
            'Flickr (blue)': '#0063dc',
            'Flickr (pink)': '#ff0084',
            'Forrst': '#5b9a68',
            'Foursquare': '#25a0ca',
            'Garmin': '#007cc3',
            'GetGlue': '#2d75a2',
            'Gimmebar': '#f70078',
            'GitHub': '#171515',
            'Google Blue': '#0140ca',
            'Google Green': '#16a61e',
            'Google Red': '#dd1812',
            'Google Yellow': '#fcca03',
            'Google+': '#dd4b39',
            'Grooveshark': '#f77f00',
            'Groupon': '#82b548',
            'Hacker News': '#ff6600',
            'HelloWallet': '#0085ca',
            'Heroku (light)': '#c7c5e6',
            'Heroku (dark)': '#6567a5',
            'HootSuite': '#003366',
            'Houzz': '#73ba37',
            'HTML5': '#ec6231',
            'IKEA': '#ffcc33',
            'IMDb': '#f3ce13',
            'Instagram': '#3f729b',
            'Intel': '#0071c5',
            'Intuit': '#365ebf',
            'Kickstarter': '#76cc1e',
            'kippt': '#e03500',
            'Kodery': '#00af81',
            'LastFM': '#c3000d',
            'LinkedIn': '#0e76a8',
            'Livestream': '#cf0005',
            'Lumo': '#576396',
            'Mixpanel': '#a086d3',
            'Meetup': '#e51937',
            'Nokia': '#183693',
            'NVIDIA': '#76b900',
            'Opera': '#cc0f16',
            'Path': '#e41f11',
            'PayPal (dark)': '#1e477a',
            'PayPal (light)': '#3b7bbf',
            'Pinboard': '#0000e6',
            'Pinterest': '#c8232c',
            'PlayStation': '#665cbe',
            'Pocket': '#ee4056',
            'Prezi': '#318bff',
            'Pusha': '#0f71b4',
            'Quora': '#a82400',
            'QUOTE.fm': '#66ceff',
            'Rdio': '#008fd5',
            'Readability': '#9c0000',
            'Red Hat': '#cc0000',
            'Resource': '#7eb400',
            'Rockpack': '#0ba6ab',
            'Roon': '#62b0d9',
            'RSS': '#ee802f',
            'Salesforce': '#1798c1',
            'Samsung': '#0c4da2',
            'Shopify': '#96bf48',
            'Skype': '#00aff0',
            'Snagajob': '#f47a20',
            'Softonic': '#008ace',
            'SoundCloud': '#ff7700',
            'Space Box': '#f86960',
            'Spotify': '#81b71a',
            'Sprint': '#fee100',
            'Squarespace': '#121212',
            'StackOverflow': '#ef8236',
            'Staples': '#cc0000',
            'Status Chart': '#d7584f',
            'Stripe': '#008cdd',
            'StudyBlue': '#00afe1',
            'StumbleUpon': '#f74425',
            'T-Mobile': '#ea0a8e',
            'Technorati': '#40a800',
            'The Next Web': '#ef4423',
            'Treehouse': '#5cb868',
            'Trulia': '#5eab1f',
            'Tumblr': '#34526f',
            'Twitch.tv': '#6441a5',
            'Twitter': '#00acee',
            'TYPO3': '#ff8700',
            'Ubuntu': '#dd4814',
            'Ustream': '#3388ff',
            'Verizon': '#ef1d1d',
            'Vimeo': '#86c9ef',
            'Vine': '#00a478',
            'Virb': '#06afd8',
            'Virgin Media': '#cc0000',
            'Wooga': '#5b009c',
            'WordPress (blue)': '#21759b',
            'WordPress (orange)': '#d54e21',
            'WordPress (grey)': '#464646',
            'Wunderlist': '#2b88d9',
            'XBOX': '#9bc848',
            'XING': '#126567',
            'Yahoo!': '#720e9e',
            'Yandex': '#ffcc00',
            'Yelp': '#c41200',
            'YouTube': '#c4302b',
            'Zalongo': '#5498dc',
            'Zendesk': '#78a300',
            'Zerply': '#9dcc7a',
            'Zootool': '#5e8b1d'
        },
        brands: function() {
            var brands = [];
            for (var b in this.brandColors) {
                brands.push(b)
            }
            return brands
        },
        /*
            https://github.com/imsky/holder
            Holder renders image placeholders entirely on the client side.

            dataImageHolder: function(size) {
                return 'holder.js/' + size
            },
        */
        dataImage: function(size, text) {
            var canvas
            if (typeof document !== 'undefined') {
                canvas = document.createElement('canvas')
            } else {
                // TODO
                // var Canvas = require('canvas')
                // canvas = new Canvas()
            }
            // canvas = (typeof document !== 'undefined') && document.createElement('canvas')

            var ctx = canvas && canvas.getContext && canvas.getContext("2d")
            if (!canvas || !ctx) return ''

            if (!size) size = this.pick(this.ad_size)
            text = text !== undefined ? text : size

            size = size.split('x')

            var width = parseInt(size[0], 10),
                height = parseInt(size[1], 10),
                background = this.brandColors[this.pick(this.brands())],
                foreground = '#FFF',
                text_height = 14,
                font = 'sans-serif';

            canvas.width = width
            canvas.height = height
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = background
            ctx.fillRect(0, 0, width, height)
            ctx.fillStyle = foreground
            ctx.font = 'bold ' + text_height + 'px ' + font
            ctx.fillText(text, (width / 2), (height / 2), width)
            return canvas.toDataURL('image/png')
        }
    }
})