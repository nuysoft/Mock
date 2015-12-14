/* global document  */
/*
    ## Image
*/
module.exports = {
    // 常见的广告宽高
    _adSize: [
        '300x250', '250x250', '240x400', '336x280', '180x150',
        '720x300', '468x60', '234x60', '88x31', '120x90',
        '120x60', '120x240', '125x125', '728x90', '160x600',
        '120x600', '300x600'
    ],
    // 常见的屏幕宽高
    _screenSize: [
        '320x200', '320x240', '640x480', '800x480', '800x480',
        '1024x600', '1024x768', '1280x800', '1440x900', '1920x1200',
        '2560x1600'
    ],
    // 常见的视频宽高
    _videoSize: ['720x480', '768x576', '1280x720', '1920x1080'],
    /*
        生成一个随机的图片地址。

        替代图片源
            http://fpoimg.com/
        参考自 
            http://rensanning.iteye.com/blog/1933310
            http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
    */
    image: function(size, background, foreground, format, text) {
        // Random.image( size, background, foreground, text )
        if (arguments.length === 4) {
            text = format
            format = undefined
        }
        // Random.image( size, background, text )
        if (arguments.length === 3) {
            text = foreground
            foreground = undefined
        }
        // Random.image()
        if (!size) size = this.pick(this._adSize)

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
    _brandColors: {
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
    _brandNames: function() {
        var brands = [];
        for (var b in this._brandColors) {
            brands.push(b)
        }
        return brands
    },
    /*
        生成一段随机的 Base64 图片编码。

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
            /*
                https://github.com/Automattic/node-canvas
                    npm install canvas --save
                安装问题：
                * http://stackoverflow.com/questions/22953206/gulp-issues-with-cario-install-command-not-found-when-trying-to-installing-canva
                * https://github.com/Automattic/node-canvas/issues/415
                * https://github.com/Automattic/node-canvas/wiki/_pages

                PS：node-canvas 的安装过程实在是太繁琐了，所以不放入 package.json 的 dependencies。
             */
            var Canvas = module.require('canvas')
            canvas = new Canvas()
        }

        var ctx = canvas && canvas.getContext && canvas.getContext("2d")
        if (!canvas || !ctx) return ''

        if (!size) size = this.pick(this._adSize)
        text = text !== undefined ? text : size

        size = size.split('x')

        var width = parseInt(size[0], 10),
            height = parseInt(size[1], 10),
            background = this._brandColors[this.pick(this._brandNames())],
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