/*! mockjs 23-06-2014 15:57:37 */
/*! src/mock-prefix.js */
/*!
    Mock - 模拟请求 & 模拟数据
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
(function(undefined) {
    var Mock = {
        version: "0.1.5",
        _mocked: {}
    };
    /*! src/util.js */
    var Util = function() {
        var Util = {};
        Util.extend = function extend() {
            var target = arguments[0] || {}, i = 1, length = arguments.length, options, name, src, copy, clone;
            if (length === 1) {
                target = this;
                i = 0;
            }
            for (;i < length; i++) {
                options = arguments[i];
                if (!options) continue;
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) continue;
                    if (copy === undefined) continue;
                    if (Util.isArray(copy) || Util.isObject(copy)) {
                        if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : [];
                        if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {};
                        target[name] = Util.extend(clone, copy);
                    } else {
                        target[name] = copy;
                    }
                }
            }
            return target;
        };
        Util.each = function each(obj, iterator, context) {
            var i, key;
            if (this.type(obj) === "number") {
                for (i = 0; i < obj; i++) {
                    iterator(i, i);
                }
            } else if (obj.length === +obj.length) {
                for (i = 0; i < obj.length; i++) {
                    if (iterator.call(context, obj[i], i, obj) === false) break;
                }
            } else {
                for (key in obj) {
                    if (iterator.call(context, obj[key], key, obj) === false) break;
                }
            }
        };
        Util.type = function type(obj) {
            return obj === null || obj === undefined ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
        };
        Util.each("String Object Array RegExp Function".split(" "), function(value) {
            Util["is" + value] = function(obj) {
                return Util.type(obj) === value.toLowerCase();
            };
        });
        Util.isObjectOrArray = function(value) {
            return Util.isObject(value) || Util.isArray(value);
        };
        Util.isNumeric = function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        };
        Util.keys = function(obj) {
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) keys.push(key);
            }
            return keys;
        };
        Util.values = function(obj) {
            var values = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) values.push(obj[key]);
            }
            return values;
        };
        Util.heredoc = function heredoc(fn) {
            return fn.toString().replace(/^[^\/]+\/\*!?/, "").replace(/\*\/[^\/]+$/, "").replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
        };
        Util.noop = function() {};
        return Util;
    }();
    /*! src/random.js */
    var Random = function() {
        var Random = {
            extend: Util.extend
        };
        Random.extend({
            "boolean": function(min, max, cur) {
                if (cur !== undefined) {
                    min = typeof min !== "undefined" && !isNaN(min) ? parseInt(min, 10) : 1;
                    max = typeof max !== "undefined" && !isNaN(max) ? parseInt(max, 10) : 1;
                    return Math.random() > 1 / (min + max) * min ? !cur : cur;
                }
                return Math.random() >= .5;
            },
            bool: function(min, max, cur) {
                return this.boolean(min, max, cur);
            },
            natural: function(min, max) {
                min = typeof min !== "undefined" ? parseInt(min, 10) : 0;
                max = typeof max !== "undefined" ? parseInt(max, 10) : 9007199254740992;
                return Math.round(Math.random() * (max - min)) + min;
            },
            integer: function(min, max) {
                min = typeof min !== "undefined" ? parseInt(min, 10) : -9007199254740992;
                max = typeof max !== "undefined" ? parseInt(max, 10) : 9007199254740992;
                return Math.round(Math.random() * (max - min)) + min;
            },
            "int": function(min, max) {
                return this.integer(min, max);
            },
            "float": function(min, max, dmin, dmax) {
                dmin = dmin === undefined ? 0 : dmin;
                dmin = Math.max(Math.min(dmin, 17), 0);
                dmax = dmax === undefined ? 17 : dmax;
                dmax = Math.max(Math.min(dmax, 17), 0);
                var ret = this.integer(min, max) + ".";
                for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
                    ret += this.character("number");
                }
                return parseFloat(ret, 10);
            },
            character: function(pool) {
                var pools = {
                    lower: "abcdefghijklmnopqrstuvwxyz",
                    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    number: "0123456789",
                    symbol: "!@#$%^&*()[]"
                };
                pools.alpha = pools.lower + pools.upper;
                pools["undefined"] = pools.lower + pools.upper + pools.number + pools.symbol;
                pool = pools[("" + pool).toLowerCase()] || pool;
                return pool.charAt(Random.natural(0, pool.length - 1));
            },
            "char": function(pool) {
                return this.character(pool);
            },
            string: function(pool, min, max) {
                var length;
                if (arguments.length === 3) {
                    length = Random.natural(min, max);
                }
                if (arguments.length === 2) {
                    if (typeof arguments[0] === "string") {
                        length = min;
                    } else {
                        length = Random.natural(pool, min);
                        pool = undefined;
                    }
                }
                if (arguments.length === 1) {
                    length = pool;
                    pool = undefined;
                }
                if (arguments.length === 0) {
                    length = Random.natural(3, 7);
                }
                var text = "";
                for (var i = 0; i < length; i++) {
                    text += Random.character(pool);
                }
                return text;
            },
            str: function(pool, min, max) {
                return this.string(pool, min, max);
            },
            range: function(start, stop, step) {
                if (arguments.length <= 1) {
                    stop = start || 0;
                    start = 0;
                }
                step = arguments[2] || 1;
                start = +start, stop = +stop, step = +step;
                var len = Math.max(Math.ceil((stop - start) / step), 0);
                var idx = 0;
                var range = new Array(len);
                while (idx < len) {
                    range[idx++] = start;
                    start += step;
                }
                return range;
            }
        });
        Random.extend({
            patternLetters: {
                yyyy: "getFullYear",
                yy: function(date) {
                    return ("" + date.getFullYear()).slice(2);
                },
                y: "yy",
                MM: function(date) {
                    var m = date.getMonth() + 1;
                    return m < 10 ? "0" + m : m;
                },
                M: function(date) {
                    return date.getMonth() + 1;
                },
                dd: function(date) {
                    var d = date.getDate();
                    return d < 10 ? "0" + d : d;
                },
                d: "getDate",
                HH: function(date) {
                    var h = date.getHours();
                    return h < 10 ? "0" + h : h;
                },
                H: "getHours",
                hh: function(date) {
                    var h = date.getHours() % 12;
                    return h < 10 ? "0" + h : h;
                },
                h: function(date) {
                    return date.getHours() % 12;
                },
                mm: function(date) {
                    var m = date.getMinutes();
                    return m < 10 ? "0" + m : m;
                },
                m: "getMinutes",
                ss: function(date) {
                    var s = date.getSeconds();
                    return s < 10 ? "0" + s : s;
                },
                s: "getSeconds",
                SS: function(date) {
                    var ms = date.getMilliseconds();
                    return ms < 10 && "00" + ms || ms < 100 && "0" + ms || ms;
                },
                S: "getMilliseconds",
                A: function(date) {
                    return date.getHours() < 12 ? "AM" : "PM";
                },
                a: function(date) {
                    return date.getHours() < 12 ? "am" : "pm";
                },
                T: "getTime"
            }
        });
        Random.extend({
            rformat: new RegExp(function() {
                var re = [];
                for (var i in Random.patternLetters) re.push(i);
                return "(" + re.join("|") + ")";
            }(), "g"),
            format: function(date, format) {
                var patternLetters = Random.patternLetters, rformat = Random.rformat;
                return format.replace(rformat, function($0, flag) {
                    return typeof patternLetters[flag] === "function" ? patternLetters[flag](date) : patternLetters[flag] in patternLetters ? arguments.callee($0, patternLetters[flag]) : date[patternLetters[flag]]();
                });
            },
            randomDate: function(min, max) {
                min = min === undefined ? new Date(0) : min;
                max = max === undefined ? new Date() : max;
                return new Date(Math.random() * (max.getTime() - min.getTime()));
            },
            date: function(format) {
                format = format || "yyyy-MM-dd";
                return this.format(this.randomDate(), format);
            },
            time: function(format) {
                format = format || "HH:mm:ss";
                return this.format(this.randomDate(), format);
            },
            datetime: function(format) {
                format = format || "yyyy-MM-dd HH:mm:ss";
                return this.format(this.randomDate(), format);
            },
            now: function(unit, format) {
                if (arguments.length === 1) {
                    if (!/year|month|week|day|hour|minute|second|week/.test(unit)) {
                        format = unit;
                        unit = "";
                    }
                }
                unit = (unit || "").toLowerCase();
                format = format || "yyyy-MM-dd HH:mm:ss";
                var date = new Date();
                switch (unit) {
                  case "year":
                    date.setMonth(0);

                  case "month":
                    date.setDate(1);

                  case "week":
                  case "day":
                    date.setHours(0);

                  case "hour":
                    date.setMinutes(0);

                  case "minute":
                    date.setSeconds(0);

                  case "second":
                    date.setMilliseconds(0);
                }
                switch (unit) {
                  case "week":
                    date.setDate(date.getDate() - date.getDay());
                }
                return this.format(date, format);
            }
        });
        Random.extend({
            ad_size: [ "300x250", "250x250", "240x400", "336x280", "180x150", "720x300", "468x60", "234x60", "88x31", "120x90", "120x60", "120x240", "125x125", "728x90", "160x600", "120x600", "300x600" ],
            screen_size: [ "320x200", "320x240", "640x480", "800x480", "800x480", "1024x600", "1024x768", "1280x800", "1440x900", "1920x1200", "2560x1600" ],
            video_size: [ "720x480", "768x576", "1280x720", "1920x1080" ],
            image: function(size, background, foreground, format, text) {
                if (arguments.length === 4) {
                    text = format;
                    format = undefined;
                }
                if (arguments.length === 3) {
                    text = foreground;
                    foreground = undefined;
                }
                if (!size) size = this.pick(this.ad_size);
                if (background && ~background.indexOf("#")) background = background.slice(1);
                if (foreground && ~foreground.indexOf("#")) foreground = foreground.slice(1);
                return "http://dummyimage.com/" + size + (background ? "/" + background : "") + (foreground ? "/" + foreground : "") + (format ? "." + format : "") + (text ? "&text=" + text : "");
            },
            img: function() {
                return this.image.apply(this, arguments);
            }
        });
        Random.extend({
            brandColors: {
                "4ormat": "#fb0a2a",
                "500px": "#02adea",
                "About.me (blue)": "#00405d",
                "About.me (yellow)": "#ffcc33",
                Addvocate: "#ff6138",
                Adobe: "#ff0000",
                Aim: "#fcd20b",
                Amazon: "#e47911",
                Android: "#a4c639",
                "Angie's List": "#7fbb00",
                AOL: "#0060a3",
                Atlassian: "#003366",
                Behance: "#053eff",
                "Big Cartel": "#97b538",
                bitly: "#ee6123",
                Blogger: "#fc4f08",
                Boeing: "#0039a6",
                "Booking.com": "#003580",
                Carbonmade: "#613854",
                Cheddar: "#ff7243",
                "Code School": "#3d4944",
                Delicious: "#205cc0",
                Dell: "#3287c1",
                Designmoo: "#e54a4f",
                Deviantart: "#4e6252",
                "Designer News": "#2d72da",
                Devour: "#fd0001",
                DEWALT: "#febd17",
                "Disqus (blue)": "#59a3fc",
                "Disqus (orange)": "#db7132",
                Dribbble: "#ea4c89",
                Dropbox: "#3d9ae8",
                Drupal: "#0c76ab",
                Dunked: "#2a323a",
                eBay: "#89c507",
                Ember: "#f05e1b",
                Engadget: "#00bdf6",
                Envato: "#528036",
                Etsy: "#eb6d20",
                Evernote: "#5ba525",
                "Fab.com": "#dd0017",
                Facebook: "#3b5998",
                Firefox: "#e66000",
                "Flickr (blue)": "#0063dc",
                "Flickr (pink)": "#ff0084",
                Forrst: "#5b9a68",
                Foursquare: "#25a0ca",
                Garmin: "#007cc3",
                GetGlue: "#2d75a2",
                Gimmebar: "#f70078",
                GitHub: "#171515",
                "Google Blue": "#0140ca",
                "Google Green": "#16a61e",
                "Google Red": "#dd1812",
                "Google Yellow": "#fcca03",
                "Google+": "#dd4b39",
                Grooveshark: "#f77f00",
                Groupon: "#82b548",
                "Hacker News": "#ff6600",
                HelloWallet: "#0085ca",
                "Heroku (light)": "#c7c5e6",
                "Heroku (dark)": "#6567a5",
                HootSuite: "#003366",
                Houzz: "#73ba37",
                HTML5: "#ec6231",
                IKEA: "#ffcc33",
                IMDb: "#f3ce13",
                Instagram: "#3f729b",
                Intel: "#0071c5",
                Intuit: "#365ebf",
                Kickstarter: "#76cc1e",
                kippt: "#e03500",
                Kodery: "#00af81",
                LastFM: "#c3000d",
                LinkedIn: "#0e76a8",
                Livestream: "#cf0005",
                Lumo: "#576396",
                Mixpanel: "#a086d3",
                Meetup: "#e51937",
                Nokia: "#183693",
                NVIDIA: "#76b900",
                Opera: "#cc0f16",
                Path: "#e41f11",
                "PayPal (dark)": "#1e477a",
                "PayPal (light)": "#3b7bbf",
                Pinboard: "#0000e6",
                Pinterest: "#c8232c",
                PlayStation: "#665cbe",
                Pocket: "#ee4056",
                Prezi: "#318bff",
                Pusha: "#0f71b4",
                Quora: "#a82400",
                "QUOTE.fm": "#66ceff",
                Rdio: "#008fd5",
                Readability: "#9c0000",
                "Red Hat": "#cc0000",
                Resource: "#7eb400",
                Rockpack: "#0ba6ab",
                Roon: "#62b0d9",
                RSS: "#ee802f",
                Salesforce: "#1798c1",
                Samsung: "#0c4da2",
                Shopify: "#96bf48",
                Skype: "#00aff0",
                Snagajob: "#f47a20",
                Softonic: "#008ace",
                SoundCloud: "#ff7700",
                "Space Box": "#f86960",
                Spotify: "#81b71a",
                Sprint: "#fee100",
                Squarespace: "#121212",
                StackOverflow: "#ef8236",
                Staples: "#cc0000",
                "Status Chart": "#d7584f",
                Stripe: "#008cdd",
                StudyBlue: "#00afe1",
                StumbleUpon: "#f74425",
                "T-Mobile": "#ea0a8e",
                Technorati: "#40a800",
                "The Next Web": "#ef4423",
                Treehouse: "#5cb868",
                Trulia: "#5eab1f",
                Tumblr: "#34526f",
                "Twitch.tv": "#6441a5",
                Twitter: "#00acee",
                TYPO3: "#ff8700",
                Ubuntu: "#dd4814",
                Ustream: "#3388ff",
                Verizon: "#ef1d1d",
                Vimeo: "#86c9ef",
                Vine: "#00a478",
                Virb: "#06afd8",
                "Virgin Media": "#cc0000",
                Wooga: "#5b009c",
                "WordPress (blue)": "#21759b",
                "WordPress (orange)": "#d54e21",
                "WordPress (grey)": "#464646",
                Wunderlist: "#2b88d9",
                XBOX: "#9bc848",
                XING: "#126567",
                "Yahoo!": "#720e9e",
                Yandex: "#ffcc00",
                Yelp: "#c41200",
                YouTube: "#c4302b",
                Zalongo: "#5498dc",
                Zendesk: "#78a300",
                Zerply: "#9dcc7a",
                Zootool: "#5e8b1d"
            },
            brands: function() {
                var brands = [];
                for (var b in this.brandColors) {
                    brands.push(b);
                }
                return brands;
            },
            dataImage: function(size, text) {
                var canvas = typeof document !== "undefined" && document.createElement("canvas"), ctx = canvas && canvas.getContext && canvas.getContext("2d");
                if (!canvas || !ctx) return "";
                if (!size) size = this.pick(this.ad_size);
                text = text !== undefined ? text : size;
                size = size.split("x");
                var width = parseInt(size[0], 10), height = parseInt(size[1], 10), background = this.brandColors[this.pick(this.brands())], foreground = "#FFF", text_height = 14, font = "sans-serif";
                canvas.width = width;
                canvas.height = height;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = foreground;
                ctx.font = "bold " + text_height + "px " + font;
                ctx.fillText(text, width / 2, height / 2, width);
                return canvas.toDataURL("image/png");
            }
        });
        Random.extend({
            color: function() {
                var colour = Math.floor(Math.random() * (16 * 16 * 16 * 16 * 16 * 16 - 1)).toString(16);
                colour = "#" + ("000000" + colour).slice(-6);
                return colour;
            }
        });
        Random.extend({
            capitalize: function(word) {
                return (word + "").charAt(0).toUpperCase() + (word + "").substr(1);
            },
            upper: function(str) {
                return (str + "").toUpperCase();
            },
            lower: function(str) {
                return (str + "").toLowerCase();
            },
            pick: function(arr) {
                arr = arr || [];
                return arr[this.natural(0, arr.length - 1)];
            },
            shuffle: function(arr) {
                arr = arr || [];
                var old = arr.slice(0), result = [], index = 0, length = old.length;
                for (var i = 0; i < length; i++) {
                    index = this.natural(0, old.length - 1);
                    result.push(old[index]);
                    old.splice(index, 1);
                }
                return result;
            }
        });
        Random.extend({
            paragraph: function(min, max) {
                var len;
                if (arguments.length === 0) len = Random.natural(3, 7);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(Random.sentence());
                }
                return arr.join(" ");
            },
            sentence: function(min, max) {
                var len;
                if (arguments.length === 0) len = Random.natural(12, 18);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(Random.word());
                }
                return Random.capitalize(arr.join(" ")) + ".";
            },
            word: function(min, max) {
                var len;
                if (arguments.length === 0) len = Random.natural(3, 10);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                var result = "";
                for (var i = 0; i < len; i++) {
                    result += Random.character("lower");
                }
                return result;
            },
            title: function(min, max) {
                var len, result = [];
                if (arguments.length === 0) len = Random.natural(3, 7);
                if (arguments.length === 1) len = max = min;
                if (arguments.length === 2) {
                    min = parseInt(min, 10);
                    max = parseInt(max, 10);
                    len = Random.natural(min, max);
                }
                for (var i = 0; i < len; i++) {
                    result.push(this.capitalize(this.word()));
                }
                return result.join(" ");
            }
        });
        Random.extend({
            first: function() {
                var names = [ "James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric" ].concat([ "Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Jessica", "Shirley", "Cynthia", "Angela", "Melissa", "Brenda", "Amy", "Anna" ]);
                return this.pick(names);
                return this.capitalize(this.word());
            },
            last: function() {
                var names = [ "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen" ];
                return this.pick(names);
                return this.capitalize(this.word());
            },
            name: function(middle) {
                return this.first() + " " + (middle ? this.first() + " " : "") + this.last();
            }
        });
        Random.extend({
            url: function() {
                return "http://" + this.domain() + "/" + this.word();
            },
            domain: function(tld) {
                return this.word() + "." + (tld || this.tld());
            },
            email: function(domain) {
                return this.character("lower") + "." + this.last().toLowerCase() + "@" + this.last().toLowerCase() + "." + this.tld();
                return this.word() + "@" + (domain || this.domain());
            },
            ip: function() {
                return this.natural(0, 255) + "." + this.natural(0, 255) + "." + this.natural(0, 255) + "." + this.natural(0, 255);
            },
            tlds: [ "com", "org", "edu", "gov", "co.uk", "net", "io" ],
            tld: function() {
                return this.pick(this.tlds);
            }
        });
        Random.extend({
            areas: [ "东北", "华北", "华东", "华中", "华南", "西南", "西北" ],
            area: function() {
                return this.pick(this.areas);
            },
            regions: [ "110000 北京市", "120000 天津市", "130000 河北省", "140000 山西省", "150000 内蒙古自治区", "210000 辽宁省", "220000 吉林省", "230000 黑龙江省", "310000 上海市", "320000 江苏省", "330000 浙江省", "340000 安徽省", "350000 福建省", "360000 江西省", "370000 山东省", "410000 河南省", "420000 湖北省", "430000 湖南省", "440000 广东省", "450000 广西壮族自治区", "460000 海南省", "500000 重庆市", "510000 四川省", "520000 贵州省", "530000 云南省", "540000 西藏自治区", "610000 陕西省", "620000 甘肃省", "630000 青海省", "640000 宁夏回族自治区", "650000 新疆维吾尔自治区", "650000 新疆维吾尔自治区", "710000 台湾省", "810000 香港特别行政区", "820000 澳门特别行政区" ],
            region: function() {
                return this.pick(this.regions).split(" ")[1];
            },
            address: function() {},
            city: function() {},
            phone: function() {},
            areacode: function() {},
            street: function() {},
            street_suffixes: function() {},
            street_suffix: function() {},
            states: function() {},
            state: function() {},
            zip: function(len) {
                var zip = "";
                for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9);
                return zip;
            }
        });
        Random.extend({
            todo: function() {
                return "todo";
            }
        });
        Random.extend({
            d4: function() {
                return this.natural(1, 4);
            },
            d6: function() {
                return this.natural(1, 6);
            },
            d8: function() {
                return this.natural(1, 8);
            },
            d12: function() {
                return this.natural(1, 12);
            },
            d20: function() {
                return this.natural(1, 20);
            },
            d100: function() {
                return this.natural(1, 100);
            },
            guid: function() {
                var pool = "ABCDEF1234567890", guid = this.string(pool, 8) + "-" + this.string(pool, 4) + "-" + this.string(pool, 4) + "-" + this.string(pool, 4) + "-" + this.string(pool, 12);
                return guid;
            },
            id: function() {
                var id, sum = 0, rank = [ "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2" ], last = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ];
                id = this.pick(this.regions).split(" ")[0] + this.date("yyyyMMdd") + this.string("number", 3);
                for (var i = 0; i < id.length; i++) {
                    sum += id[i] * rank[i];
                }
                id += last[sum % 11];
                return id;
            },
            autoIncrementInteger: 0,
            increment: function(step) {
                return this.autoIncrementInteger += +step || 1;
            },
            inc: function(step) {
                return this.increment(step);
            }
        });
        return Random;
    }();
    /*! src/mock.js */
    var rkey = /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/, rrange = /([\+\-]?\d+)-?([\+\-]?\d+)?/, rplaceholder = /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g;
    Mock.extend = Util.extend;
    Mock.mock = function(rurl, rtype, template) {
        if (arguments.length === 1) {
            return Handle.gen(rurl);
        }
        if (arguments.length === 2) {
            template = rtype;
            rtype = undefined;
        }
        Mock._mocked[rurl + (rtype || "")] = {
            rurl: rurl,
            rtype: rtype,
            template: template
        };
        return Mock;
    };
    var Handle = {
        extend: Util.extend
    };
    Handle.rule = function(name) {
        name = (name || "") + "";
        var parameters = (name || "").match(rkey), range = parameters && parameters[3] && parameters[3].match(rrange), min = range && parseInt(range[1], 10), max = range && parseInt(range[2], 10), count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1, decimal = parameters && parameters[4] && parameters[4].match(rrange), dmin = decimal && parseInt(decimal[1], 10), dmax = decimal && parseInt(decimal[2], 10), dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : 0, point = parameters && parameters[4];
        return {
            parameters: parameters,
            range: range,
            min: min,
            max: max,
            count: count,
            decimal: decimal,
            dmin: dmin,
            dmax: dmax,
            dcount: dcount,
            point: point
        };
    };
    Handle.gen = function(template, name, context) {
        name = name = (name || "") + "";
        context = context || {};
        context = {
            path: context.path || [],
            templatePath: context.templatePath || [],
            currentContext: context.currentContext,
            templateCurrentContext: context.templateCurrentContext || template,
            root: context.root,
            templateRoot: context.templateRoot
        };
        var rule = Handle.rule(name);
        var type = Util.type(template);
        if (Handle[type]) {
            return Handle[type]({
                type: type,
                template: template,
                name: name,
                parsedName: name ? name.replace(rkey, "$1") : name,
                rule: rule,
                context: context
            });
        }
        return template;
    };
    Handle.extend({
        array: function(options) {
            var result = [], i, j;
            if (!options.rule.parameters) {
                for (i = 0; i < options.template.length; i++) {
                    options.context.path.push(i);
                    result.push(Handle.gen(options.template[i], i, {
                        currentContext: result,
                        templateCurrentContext: options.template,
                        path: options.context.path
                    }));
                    options.context.path.pop();
                }
            } else {
                if (options.rule.count === 1 && options.template.length > 1) {
                    options.context.path.push(options.name);
                    result = Random.pick(Handle.gen(options.template, undefined, {
                        currentContext: result,
                        templateCurrentContext: options.template,
                        path: options.context.path
                    }));
                    options.context.path.pop();
                } else {
                    for (i = 0; i < options.rule.count; i++) {
                        j = 0;
                        do {
                            result.push(Handle.gen(options.template[j++]));
                        } while (j < options.template.length);
                    }
                }
            }
            return result;
        },
        object: function(options) {
            var result = {}, keys, fnKeys, key, parsedKey, inc, i;
            if (options.rule.min) {
                keys = Util.keys(options.template);
                keys = Random.shuffle(keys);
                keys = keys.slice(0, options.rule.count);
                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    parsedKey = key.replace(rkey, "$1");
                    options.context.path.push(parsedKey);
                    result[parsedKey] = Handle.gen(options.template[key], key, {
                        currentContext: result,
                        templateCurrentContext: options.template,
                        path: options.context.path
                    });
                    options.context.path.pop();
                }
            } else {
                keys = [];
                fnKeys = [];
                for (key in options.template) {
                    (typeof options.template[key] === "function" ? fnKeys : keys).push(key);
                }
                keys = keys.concat(fnKeys);
                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    parsedKey = key.replace(rkey, "$1");
                    options.context.path.push(parsedKey);
                    result[parsedKey] = Handle.gen(options.template[key], key, {
                        currentContext: result,
                        templateCurrentContext: options.template,
                        path: options.context.path
                    });
                    options.context.path.pop();
                    inc = key.match(rkey);
                    if (inc && inc[2] && Util.type(options.template[key]) === "number") {
                        options.template[key] += parseInt(inc[2], 10);
                    }
                }
            }
            return result;
        },
        number: function(options) {
            var result, parts, i;
            if (options.rule.point) {
                options.template += "";
                parts = options.template.split(".");
                parts[0] = options.rule.range ? options.rule.count : parts[0];
                parts[1] = (parts[1] || "").slice(0, options.rule.dcount);
                for (i = 0; parts[1].length < options.rule.dcount; i++) {
                    parts[1] += Random.character("number");
                }
                result = parseFloat(parts.join("."), 10);
            } else {
                result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template;
            }
            return result;
        },
        "boolean": function(options) {
            var result;
            result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template;
            return result;
        },
        string: function(options) {
            var result = "", i, placeholders, ph, phed;
            if (options.template.length) {
                for (i = 0; i < options.rule.count; i++) {
                    result += options.template;
                }
                placeholders = result.match(rplaceholder) || [];
                for (i = 0; i < placeholders.length; i++) {
                    ph = placeholders[i];
                    if (/^\\/.test(ph)) {
                        placeholders.splice(i--, 1);
                        continue;
                    }
                    phed = Handle.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext);
                    if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) {
                        result = phed;
                        break;
                        if (Util.isNumeric(phed)) {
                            result = parseFloat(phed, 10);
                            break;
                        }
                        if (/^(true|false)$/.test(phed)) {
                            result = phed === "true" ? true : phed === "false" ? false : phed;
                            break;
                        }
                    }
                    result = result.replace(ph, phed);
                }
            } else {
                result = options.rule.range ? Random.string(options.rule.count) : options.template;
            }
            return result;
        },
        "function": function(options) {
            return options.template.call(options.context.currentContext);
        }
    });
    Handle.extend({
        _all: function() {
            var re = {};
            for (var key in Random) re[key.toLowerCase()] = key;
            return re;
        },
        placeholder: function(placeholder, obj, templateContext) {
            rplaceholder.exec("");
            var parts = rplaceholder.exec(placeholder), key = parts && parts[1], lkey = key && key.toLowerCase(), okey = this._all()[lkey], params = parts && parts[2] || "";
            try {
                params = eval("(function(){ return [].splice.call(arguments, 0 ) })(" + params + ")");
            } catch (error) {
                params = parts[2].split(/,\s*/);
            }
            if (obj && key in obj) return obj[key];
            if (templateContext && typeof templateContext === "object" && key in templateContext && placeholder !== templateContext[key]) {
                templateContext[key] = Handle.gen(templateContext[key], key, {
                    currentContext: obj,
                    templateCurrentContext: templateContext
                });
                return templateContext[key];
            }
            if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder;
            for (var i = 0; i < params.length; i++) {
                rplaceholder.exec("");
                if (rplaceholder.test(params[i])) {
                    params[i] = Handle.placeholder(params[i], obj);
                }
            }
            var handle = Random[key] || Random[lkey] || Random[okey];
            switch (Util.type(handle)) {
              case "array":
                return Random.pick(handle);

              case "function":
                var re = handle.apply(Random, params);
                if (re === undefined) re = "";
                return re;
            }
        }
    });
    /*! src/mockjax.js */
    function find(options) {
        for (var sUrlType in Mock._mocked) {
            var item = Mock._mocked[sUrlType];
            if ((!item.rurl || match(item.rurl, options.url)) && (!item.rtype || match(item.rtype, options.type.toLowerCase()))) {
                return item;
            }
        }
        function match(expected, actual) {
            if (Util.type(expected) === "string") {
                return expected === actual;
            }
            if (Util.type(expected) === "regexp") {
                return expected.test(actual);
            }
        }
    }
    function convert(item, options) {
        return Util.isFunction(item.template) ? item.template(options) : Mock.mock(item.template);
    }
    Mock.mockjax = function mockjax(jQuery) {
        function mockxhr() {
            return {
                readyState: 4,
                status: 200,
                statusText: "",
                open: jQuery.noop,
                send: function() {
                    if (this.onload) this.onload();
                },
                setRequestHeader: jQuery.noop,
                getAllResponseHeaders: jQuery.noop,
                getResponseHeader: jQuery.noop,
                statusCode: jQuery.noop,
                abort: jQuery.noop
            };
        }
        function prefilter(options, originalOptions, jqXHR) {
            var item = find(options);
            if (item) {
                options.dataFilter = options.converters["text json"] = options.converters["text jsonp"] = options.converters["text script"] = options.converters["script json"] = function() {
                    return convert(item, options);
                };
                options.xhr = mockxhr;
                if (originalOptions.dataType !== "script") return "json";
            }
        }
        jQuery.ajaxPrefilter("json jsonp script", prefilter);
        return Mock;
    };
    if (typeof jQuery != "undefined") Mock.mockjax(jQuery);
    if (typeof Zepto != "undefined") {
        Mock.mockjax = function(Zepto) {
            var __original_ajax = Zepto.ajax;
            var xhr = {
                readyState: 4,
                responseText: "",
                responseXML: null,
                state: 2,
                status: 200,
                statusText: "success",
                timeoutTimer: null
            };
            Zepto.ajax = function(options) {
                var item = find(options);
                if (item) {
                    var data = Mock.mock(item.template);
                    if (options.success) options.success(data, xhr, options);
                    if (options.complete) options.complete(xhr.status, xhr, options);
                    return xhr;
                }
                return __original_ajax.call(Zepto, options);
            };
        };
        Mock.mockjax(Zepto);
    }
    if (typeof KISSY != "undefined" && KISSY.add) {
        Mock.mockjax = function mockjax(KISSY) {
            var _original_ajax = KISSY.io;
            var xhr = {
                readyState: 4,
                responseText: "",
                responseXML: null,
                state: 2,
                status: 200,
                statusText: "success",
                timeoutTimer: null
            };
            KISSY.io = function(options) {
                var item = find(options);
                if (item) {
                    var data = Mock.mock(item.template);
                    if (options.success) options.success(data, xhr, options);
                    if (options.complete) options.complete(xhr.status, xhr, options);
                    return xhr;
                }
                return _original_ajax.apply(this, arguments);
            };
            for (var name in _original_ajax) {
                KISSY.io[name] = _original_ajax[name];
            }
        };
    }
    /*! src/expose.js */
    Mock.Util = Util;
    Mock.Random = Random;
    Mock.heredoc = Util.heredoc;
    if (typeof module === "object" && module.exports) {
        module.exports = Mock;
    } else if (typeof define === "function" && define.amd) {
        define(function() {
            return Mock;
        });
    } else if (typeof define === "function" && define.cmd) {
        define(function() {
            return Mock;
        });
    }
    this.Mock = Mock;
    this.Random = Random;
    if (typeof KISSY != "undefined") {
        Util.each([ "mock", "components/mock/", "mock/dist/mock", "gallery/Mock/0.1.1/", "gallery/Mock/0.1.2/", "gallery/Mock/0.1.3/" ], function register(name) {
            KISSY.add(name, function(S) {
                Mock.mockjax(S);
                return Mock;
            }, {
                requires: [ "ajax" ]
            });
        });
    }
    /*! src/mock4tpl.js */
    (function(undefined) {
        var Mock4Tpl = {
            version: "0.0.1"
        };
        if (!this.Mock) module.exports = Mock4Tpl;
        Mock.tpl = function(input, options, helpers, partials) {
            return Mock4Tpl.mock(input, options, helpers, partials);
        };
        Mock.parse = function(input) {
            return Handlebars.parse(input);
        };
        Mock4Tpl.mock = function(input, options, helpers, partials) {
            helpers = helpers ? Util.extend({}, helpers, Handlebars.helpers) : Handlebars.helpers;
            partials = partials ? Util.extend({}, partials, Handlebars.partials) : Handlebars.partials;
            return Handle.gen(input, null, options, helpers, partials);
        };
        var Handle = {
            debug: Mock4Tpl.debug || false,
            extend: Util.extend
        };
        Handle.gen = function(node, context, options, helpers, partials) {
            if (Util.isString(node)) {
                var ast = Handlebars.parse(node);
                options = Handle.parseOptions(node, options);
                var data = Handle.gen(ast, context, options, helpers, partials);
                return data;
            }
            context = context || [ {} ];
            options = options || {};
            if (this[node.type] === Util.noop) return;
            options.__path = options.__path || [];
            if (Mock4Tpl.debug || Handle.debug) {
                console.log();
                console.group("[" + node.type + "]", JSON.stringify(node));
                console.log("[options]", options.__path.length, JSON.stringify(options));
            }
            var preLength = options.__path.length;
            this[node.type](node, context, options, helpers, partials);
            options.__path.splice(preLength);
            if (Mock4Tpl.debug || Handle.debug) {
                console.groupEnd();
            }
            return context[context.length - 1];
        };
        Handle.parseOptions = function(input, options) {
            var rComment = /<!--\s*\n*Mock\s*\n*([\w\W]+?)\s*\n*-->/g;
            var comments = input.match(rComment), ret = {}, i, ma, option;
            for (i = 0; comments && i < comments.length; i++) {
                rComment.lastIndex = 0;
                ma = rComment.exec(comments[i]);
                if (ma) {
                    option = new Function("return " + ma[1]);
                    option = option();
                    Util.extend(ret, option);
                }
            }
            return Util.extend(ret, options);
        };
        Handle.val = function(name, options, context, def) {
            if (name !== options.__path[options.__path.length - 1]) throw new Error(name + "!==" + options.__path);
            if (Mock4Tpl.debug || Handle.debug) console.log("[options]", name, options.__path);
            if (def !== undefined) def = Mock.mock(def);
            if (options) {
                var mocked = Mock.mock(options);
                if (Util.isString(mocked)) return mocked;
                if (name in mocked) {
                    return mocked[name];
                }
            }
            if (Util.isArray(context[0])) return {};
            return def !== undefined ? def : name || Random.word();
        };
        Handle.program = function(node, context, options, helpers, partials) {
            for (var i = 0; i < node.statements.length; i++) {
                this.gen(node.statements[i], context, options, helpers, partials);
            }
        };
        Handle.mustache = function(node, context, options, helpers, partials) {
            var i, currentContext = context[0], contextLength = context.length;
            if (Util.type(currentContext) === "array") {
                currentContext.push({});
                currentContext = currentContext[currentContext.length - 1];
                context.unshift(currentContext);
            }
            if (node.isHelper || helpers && helpers[node.id.string]) {
                if (node.params.length === 0) {} else {
                    for (i = 0; i < node.params.length; i++) {
                        this.gen(node.params[i], context, options, helpers, partials);
                    }
                }
                if (node.hash) this.gen(node.hash, context, options, helpers, partials);
            } else {
                this.gen(node.id, context, options, helpers, partials);
            }
            if (context.length > contextLength) context.splice(0, context.length - contextLength);
        };
        Handle.block = function(node, context, options, helpers, partials) {
            var parts = node.mustache.id.parts, i, len, cur, val, type, currentContext = context[0], contextLength = context.length;
            if (node.inverse) {}
            if (node.mustache.isHelper || helpers && helpers[node.mustache.id.string]) {
                type = parts[0];
                val = (Helpers[type] || Helpers.custom).apply(this, arguments);
                currentContext = context[0];
            } else {
                for (i = 0; i < parts.length; i++) {
                    options.__path.push(parts[i]);
                    cur = parts[i];
                    val = this.val(cur, options, context, {});
                    currentContext[cur] = Util.isArray(val) && [] || val;
                    type = Util.type(currentContext[cur]);
                    if (type === "object" || type === "array") {
                        currentContext = currentContext[cur];
                        context.unshift(currentContext);
                    }
                }
            }
            if (node.program) {
                if (Util.type(currentContext) === "array") {
                    len = val.length || Random.integer(3, 7);
                    for (i = 0; i < len; i++) {
                        currentContext.push(typeof val[i] !== "undefined" ? val[i] : {});
                        options.__path.push("[]");
                        context.unshift(currentContext[currentContext.length - 1]);
                        this.gen(node.program, context, options, helpers, partials);
                        options.__path.pop();
                        context.shift();
                    }
                } else this.gen(node.program, context, options, helpers, partials);
            }
            if (context.length > contextLength) context.splice(0, context.length - contextLength);
        };
        Handle.hash = function(node, context, options, helpers, partials) {
            var pairs = node.pairs, pair, i, j;
            for (i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                for (j = 1; j < pair.length; j++) {
                    this.gen(pair[j], context, options, helpers, partials);
                }
            }
        };
        Handle.ID = function(node, context, options) {
            var parts = node.parts, i, len, cur, prev, def, val, type, valType, preOptions, currentContext = context[node.depth], contextLength = context.length;
            if (Util.isArray(currentContext)) currentContext = context[node.depth + 1];
            if (!parts.length) {} else {
                for (i = 0, len = parts.length; i < len; i++) {
                    options.__path.push(parts[i]);
                    cur = parts[i];
                    prev = parts[i - 1];
                    preOptions = options[prev];
                    def = i === len - 1 ? currentContext[cur] : {};
                    val = this.val(cur, options, context, def);
                    type = Util.type(currentContext[cur]);
                    valType = Util.type(val);
                    if (type === "undefined") {
                        if (i < len - 1 && valType !== "object" && valType !== "array") {
                            currentContext[cur] = {};
                        } else {
                            currentContext[cur] = Util.isArray(val) && [] || val;
                        }
                    } else {
                        if (i < len - 1 && type !== "object" && type !== "array") {
                            currentContext[cur] = Util.isArray(val) && [] || {};
                        }
                    }
                    type = Util.type(currentContext[cur]);
                    if (type === "object" || type === "array") {
                        currentContext = currentContext[cur];
                        context.unshift(currentContext);
                    }
                }
            }
            if (context.length > contextLength) context.splice(0, context.length - contextLength);
        };
        Handle.partial = function(node, context, options, helpers, partials) {
            var name = node.partialName.name, partial = partials && partials[name], contextLength = context.length;
            if (partial) Handle.gen(partial, context, options, helpers, partials);
            if (context.length > contextLength) context.splice(0, context.length - contextLength);
        };
        Handle.content = Util.noop;
        Handle.PARTIAL_NAME = Util.noop;
        Handle.DATA = Util.noop;
        Handle.STRING = Util.noop;
        Handle.INTEGER = Util.noop;
        Handle.BOOLEAN = Util.noop;
        Handle.comment = Util.noop;
        var Helpers = {};
        Helpers.each = function(node, context, options) {
            var i, len, cur, val, parts, def, type, currentContext = context[0];
            parts = node.mustache.params[0].parts;
            for (i = 0, len = parts.length; i < len; i++) {
                options.__path.push(parts[i]);
                cur = parts[i];
                def = i === len - 1 ? [] : {};
                val = this.val(cur, options, context, def);
                currentContext[cur] = Util.isArray(val) && [] || val;
                type = Util.type(currentContext[cur]);
                if (type === "object" || type === "array") {
                    currentContext = currentContext[cur];
                    context.unshift(currentContext);
                }
            }
            return val;
        };
        Helpers["if"] = Helpers.unless = function(node, context, options) {
            var params = node.mustache.params, i, j, cur, val, parts, def, type, currentContext = context[0];
            for (i = 0; i < params.length; i++) {
                parts = params[i].parts;
                for (j = 0; j < parts.length; j++) {
                    if (i === 0) options.__path.push(parts[j]);
                    cur = parts[j];
                    def = j === parts.length - 1 ? "@BOOL(2,1,true)" : {};
                    val = this.val(cur, options, context, def);
                    if (j === parts.length - 1) {
                        val = val === "true" ? true : val === "false" ? false : val;
                    }
                    currentContext[cur] = Util.isArray(val) ? [] : val;
                    type = Util.type(currentContext[cur]);
                    if (type === "object" || type === "array") {
                        currentContext = currentContext[cur];
                        context.unshift(currentContext);
                    }
                }
            }
            return val;
        };
        Helpers["with"] = function(node, context, options) {
            var i, cur, val, parts, def, currentContext = context[0];
            parts = node.mustache.params[0].parts;
            for (i = 0; i < parts.length; i++) {
                options.__path.push(parts[i]);
                cur = parts[i];
                def = {};
                val = this.val(cur, options, context, def);
                currentContext = currentContext[cur] = val;
                context.unshift(currentContext);
            }
            return val;
        };
        Helpers.log = function() {};
        Helpers.custom = function(node, context, options) {
            var i, len, cur, val, parts, def, type, currentContext = context[0];
            if (node.mustache.params.length === 0) {
                return;
                options.__path.push(node.mustache.id.string);
                cur = node.mustache.id.string;
                def = "@BOOL(2,1,true)";
                val = this.val(cur, options, context, def);
                currentContext[cur] = Util.isArray(val) && [] || val;
                type = Util.type(currentContext[cur]);
                if (type === "object" || type === "array") {
                    currentContext = currentContext[cur];
                    context.unshift(currentContext);
                }
            } else {
                parts = node.mustache.params[0].parts;
                for (i = 0, len = parts.length; i < len; i++) {
                    options.__path.push(parts[i]);
                    cur = parts[i];
                    def = i === len - 1 ? [] : {};
                    val = this.val(cur, options, context, def);
                    currentContext[cur] = Util.isArray(val) && [] || val;
                    type = Util.type(currentContext[cur]);
                    if (type === "object" || type === "array") {
                        currentContext = currentContext[cur];
                        context.unshift(currentContext);
                    }
                }
            }
            return val;
        };
    }).call(this);
    /*! src/mock4xtpl.js */
    (function(undefined) {
        if (typeof KISSY === "undefined") return;
        var Mock4XTpl = {
            debug: false
        };
        var XTemplate;
        KISSY.use("xtemplate", function(S, T) {
            XTemplate = T;
        });
        if (!this.Mock) module.exports = Mock4XTpl;
        Mock.xtpl = function(input, options, helpers, partials) {
            return Mock4XTpl.mock(input, options, helpers, partials);
        };
        Mock.xparse = function(input) {
            return XTemplate.compiler.parse(input);
        };
        Mock4XTpl.mock = function(input, options, helpers, partials) {
            helpers = helpers ? Util.extend({}, helpers, XTemplate.RunTime.commands) : XTemplate.RunTime.commands;
            partials = partials ? Util.extend({}, partials, XTemplate.RunTime.subTpls) : XTemplate.RunTime.subTpls;
            return this.gen(input, null, options, helpers, partials, {});
        };
        Mock4XTpl.parse = function(input) {
            return XTemplate.compiler.parse(input);
        };
        Mock4XTpl.gen = function(node, context, options, helpers, partials, other) {
            if (typeof node === "string") {
                if (Mock4XTpl.debug) {
                    console.log("[tpl    ]\n", node);
                }
                var ast = this.parse(node);
                options = this.parseOptions(node, options);
                var data = this.gen(ast, context, options, helpers, partials, other);
                return data;
            }
            context = context || [ {} ];
            options = options || {};
            node.type = node.type;
            if (this[node.type] === Util.noop) return;
            options.__path = options.__path || [];
            if (Mock4XTpl.debug) {
                console.log();
                console.group("[" + node.type + "]", JSON.stringify(node));
                console.log("[context]", "[before]", context.length, JSON.stringify(context));
                console.log("[options]", "[before]", options.__path.length, JSON.stringify(options));
                console.log("[other  ]", "[before]", JSON.stringify(other));
            }
            var preLength = options.__path.length;
            this[node.type](node, context, options, helpers, partials, other);
            if (Mock4XTpl.debug) {
                console.log("[__path ]", "[after ]", options.__path);
            }
            if (!other.hold || typeof other.hold === "function" && !other.hold(node, options, context)) {
                options.__path.splice(preLength);
            }
            if (Mock4XTpl.debug) {
                console.log("[context]", "[after ]", context.length, JSON.stringify(context));
                console.groupEnd();
            }
            return context[context.length - 1];
        };
        Mock4XTpl.parseOptions = function(input, options) {
            var rComment = /<!--\s*\n*Mock\s*\n*([\w\W]+?)\s*\n*-->/g;
            var comments = input.match(rComment), ret = {}, i, ma, option;
            for (i = 0; comments && i < comments.length; i++) {
                rComment.lastIndex = 0;
                ma = rComment.exec(comments[i]);
                if (ma) {
                    option = new Function("return " + ma[1]);
                    option = option();
                    Util.extend(ret, option);
                }
            }
            return Util.extend(ret, options);
        };
        Mock4XTpl.parseVal = function(expr, object) {
            function queryArray(prop, context) {
                if (typeof context === "object" && prop in context) return [ context[prop] ];
                var ret = [];
                for (var i = 0; i < context.length; i++) {
                    ret.push.apply(ret, query(prop, [ context[i] ]));
                }
                return ret;
            }
            function queryObject(prop, context) {
                if (typeof context === "object" && prop in context) return [ context[prop] ];
                var ret = [];
                for (var key in context) {
                    ret.push.apply(ret, query(prop, [ context[key] ]));
                }
                return ret;
            }
            function query(prop, set) {
                var ret = [];
                for (var i = 0; i < set.length; i++) {
                    if (typeof set[i] !== "object") continue;
                    if (prop in set[i]) ret.push(set[i][prop]); else {
                        ret.push.apply(ret, Util.isArray(set[i]) ? queryArray(prop, set[i]) : queryObject(prop, set[i]));
                    }
                }
                return ret;
            }
            function parse(expr, context) {
                var parts = typeof expr === "string" ? expr.split(".") : expr.slice(0), set = [ context ];
                while (parts.length) {
                    set = query(parts.shift(), set);
                }
                return set;
            }
            return parse(expr, object);
        };
        Mock4XTpl.val = function(name, options, context, def) {
            if (name !== options.__path[options.__path.length - 1]) throw new Error(name + "!==" + options.__path);
            if (def !== undefined) def = Mock.mock(def);
            if (options) {
                var mocked = Mock.mock(options);
                if (Util.isString(mocked)) return mocked;
                var ret = Mock4XTpl.parseVal(options.__path, mocked);
                if (ret.length > 0) return ret[0];
                if (name in mocked) {
                    return mocked[name];
                }
            }
            if (Util.isArray(context[0])) return {};
            return def !== undefined ? def : name;
        };
        Mock4XTpl.program = function(node, context, options, helpers, partials, other) {
            for (var i = 0; i < node.statements.length; i++) {
                this.gen(node.statements[i], context, options, helpers, partials, other);
            }
            for (var j = 0; node.inverse && j < node.inverse.length; j++) {
                this.gen(node.inverse[j], context, options, helpers, partials, other);
            }
        };
        Mock4XTpl.block = function(node, context, options, helpers, partials, other) {
            var contextLength = context.length;
            this.gen(node.tpl, context, options, helpers, partials, Util.extend({}, other, {
                def: {},
                hold: true
            }));
            var currentContext = context[0], mocked, i, len;
            if (Util.type(currentContext) === "array") {
                mocked = this.val(options.__path[options.__path.length - 1], options, context);
                len = mocked && mocked.length || Random.integer(3, 7);
                for (i = 0; i < len; i++) {
                    currentContext.push(mocked && mocked[i] !== undefined ? mocked[i] : {});
                    options.__path.push(i);
                    context.unshift(currentContext[currentContext.length - 1]);
                    this.gen(node.program, context, options, helpers, partials, other);
                    options.__path.pop();
                    context.shift();
                }
            } else this.gen(node.program, context, options, helpers, partials, other);
            if (!other.hold || typeof other.hold === "function" && !other.hold(node, options, context)) {
                context.splice(0, context.length - contextLength);
            }
        };
        Mock4XTpl.tpl = function(node, context, options, helpers, partials, other) {
            if (node.params && node.params.length) {
                other = Util.extend({}, other, {
                    def: {
                        each: [],
                        "if": "@BOOL(2,1,true)",
                        unless: "@BOOL(2,1,false)",
                        "with": {}
                    }[node.path.string],
                    hold: {
                        each: true,
                        "if": function(_, __, ___, name, value) {
                            return typeof value === "object";
                        },
                        unless: function(_, __, ___, name, value) {
                            return typeof value === "object";
                        },
                        "with": true,
                        include: false
                    }[node.path.string]
                });
                for (var i = 0, input; i < node.params.length; i++) {
                    if (node.path.string === "include") {
                        input = partials && partials[node.params[i].value];
                    } else input = node.params[i];
                    if (input) this.gen(input, context, options, helpers, partials, other);
                }
                if (node.hash) {
                    this.gen(node.hash, context, options, helpers, partials, other);
                }
            } else {
                this.gen(node.path, context, options, helpers, partials, other);
            }
        };
        Mock4XTpl.tplExpression = function(node, context, options, helpers, partials, other) {
            this.gen(node.expression, context, options, helpers, partials, other);
        };
        Mock4XTpl.content = Util.noop;
        Mock4XTpl.unaryExpression = Util.noop;
        Mock4XTpl.multiplicativeExpression = Mock4XTpl.additiveExpression = function(node, context, options, helpers, partials, other) {
            this.gen(node.op1, context, options, helpers, partials, Util.extend({}, other, {
                def: function() {
                    return node.op2.type === "number" ? node.op2.value.indexOf(".") > -1 ? Random.float(-Math.pow(10, 10), Math.pow(10, 10), 1, Math.pow(10, 6)) : Random.integer() : undefined;
                }()
            }));
            this.gen(node.op2, context, options, helpers, partials, Util.extend({}, other, {
                def: function() {
                    return node.op1.type === "number" ? node.op1.value.indexOf(".") > -1 ? Random.float(-Math.pow(10, 10), Math.pow(10, 10), 1, Math.pow(10, 6)) : Random.integer() : undefined;
                }()
            }));
        };
        Mock4XTpl.relationalExpression = function(node, context, options, helpers, partials, other) {
            this.gen(node.op1, context, options, helpers, partials, other);
            this.gen(node.op2, context, options, helpers, partials, other);
        };
        Mock4XTpl.equalityExpression = Util.noop;
        Mock4XTpl.conditionalAndExpression = Util.noop;
        Mock4XTpl.conditionalOrExpression = Util.noop;
        Mock4XTpl.string = Util.noop;
        Mock4XTpl.number = Util.noop;
        Mock4XTpl.boolean = Util.noop;
        Mock4XTpl.hash = function(node, context, options, helpers, partials, other) {
            var pairs = node.value, key;
            for (key in pairs) {
                this.gen(pairs[key], context, options, helpers, partials, other);
            }
        };
        Mock4XTpl.id = function(node, context, options, helpers, partials, other) {
            var contextLength = context.length;
            var parts = node.parts, currentContext = context[node.depth], i, len, cur, def, val;
            function fix(currentContext, index, length, name, val) {
                var type = Util.type(currentContext[name]), valType = Util.type(val);
                val = val === "true" ? true : val === "false" ? false : val;
                if (type === "undefined") {
                    if (index < length - 1 && !Util.isObjectOrArray(val)) {
                        currentContext[name] = {};
                    } else {
                        currentContext[name] = Util.isArray(val) && [] || val;
                    }
                } else {
                    if (index < length - 1 && type !== "object" && type !== "array") {
                        currentContext[name] = Util.isArray(val) && [] || {};
                    } else {
                        if (type !== "object" && type !== "array" && valType !== "object" && valType !== "array") {
                            currentContext[name] = val;
                        }
                    }
                }
                return currentContext[name];
            }
            if (Util.isArray(currentContext)) currentContext = context[node.depth + 1];
            for (i = 0, len = parts.length; i < len; i++) {
                if (i === 0 && parts[i] === "this") continue;
                if (/^(xindex|xcount|xkey)$/.test(parts[i])) continue;
                if (i === 0 && len === 1 && parts[i] in helpers) continue;
                options.__path.push(parts[i]);
                cur = parts[i];
                def = i === len - 1 ? other.def !== undefined ? other.def : context[0][cur] : {};
                val = this.val(cur, options, context, def);
                if (Mock4XTpl.debug) {
                    console.log("[def    ]", JSON.stringify(def));
                    console.log("[val    ]", JSON.stringify(val));
                }
                val = fix(currentContext, i, len, cur, val);
                if (Util.isObjectOrArray(currentContext[cur])) {
                    context.unshift(currentContext = currentContext[cur]);
                }
            }
            if (!other.hold || typeof other.hold === "function" && !other.hold(node, options, context, cur, val)) {
                context.splice(0, context.length - contextLength);
            }
        };
    }).call(this);
}).call(this);