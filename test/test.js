Mock.mock({
    "string|1-10": "★",
});
Mock.mock({
    "string|3": "★★★",
});
Mock.mock({
    "number|+1": 202,
});
Mock.mock({
    "number|1-100": 100,
});
Mock.mock({
    "number|1-100.1-10": 1,
});
Mock.mock({
    "number|123.1-10": 1,
});
Mock.mock({
    "number|123.3": 1,
});
Mock.mock({
    "number|123.10": 1.123,
});
Mock.mock({
    "boolean|1": true,
});
Mock.mock({
    "boolean|1-2": true,
});
Mock.mock({
    "object|2": {
        310000: "上海市",
        320000: "江苏省",
        330000: "浙江省",
        340000: "安徽省",
    },
});
Mock.mock({
    "object|2-4": {
        110000: "北京市",
        120000: "天津市",
        130000: "河北省",
        140000: "山西省",
    },
});
Mock.mock({
    "array|1": ["AMD", "CMD", "UMD"],
});
Mock.mock({
    "array|+1": ["AMD", "CMD", "UMD"],
});
Mock.mock({
    "array|1-10": [
        {
            "name|+1": ["Hello", "Mock.js", "!"],
        },
    ],
});
Mock.mock({
    "array|1-10": ["Mock.js"],
});
Mock.mock({
    "array|1-10": ["Hello", "Mock.js", "!"],
});
Mock.mock({
    "array|3": ["Mock.js"],
});
Mock.mock({
    "array|3": ["Hello", "Mock.js", "!"],
});
Mock.mock({
    foo: "Syntax Demo",
    name: function () {
        return this.foo;
    },
});
Mock.mock({
    regexp: /[a-z][A-Z][0-9]/,
});
Mock.mock({
    regexp: /\w\W\s\S\d\D/,
});
Mock.mock({
    regexp: /\d{5,10}/,
});
Mock.mock({
    "regexp|3": /\d{5,10}\-/,
});
Mock.mock({
    "regexp|1-5": /\d{5,10}\-/,
});
Mock.mock({
    foo: "Hello",
    nested: {
        a: {
            b: {
                c: "Mock.js",
            },
        },
    },
    absolutePath: "@/foo @/nested/a/b/c",
});
Mock.mock({
    foo: "Hello",
    nested: {
        a: {
            b: {
                c: "Mock.js",
            },
        },
    },
    relativePath: {
        a: {
            b: {
                c: "@../../../foo @../../../nested/a/b/c",
            },
        },
    },
});
// Mock.Random.boolean()
Mock.Random.boolean();
Mock.mock("@boolean");
Mock.mock("@boolean()");

// Mock.Random.boolean( min, max, current )
Mock.Random.boolean(1, 9, true);
Mock.mock("@boolean(1, 9, true)");
// Mock.Random.natural()
Mock.Random.natural();
Mock.mock("@natural");
Mock.mock("@natural()");

// Mock.Random.natural( min )
Mock.Random.natural(10000);
Mock.mock("@natural(10000)");

// Mock.Random.natural( min, max )
Mock.Random.natural(60, 100);
Mock.mock("@natural(60, 100)");
// Mock.Random.integer()
Mock.Random.integer();
Mock.mock("@integer");
Mock.mock("@integer()");

// Mock.Random.integer( min )
Mock.Random.integer(10000);
Mock.mock("@integer(10000)");

// Mock.Random.integer( min, max )
Mock.Random.integer(60, 100);
Mock.mock("@integer(60, 100)");
// Mock.Random.float()
Mock.Random.float();
Mock.mock("@float");
Mock.mock("@float()");

// Mock.Random.float( min )
Mock.Random.float(0);
Mock.mock("@float(0)");

// Mock.Random.float( min, max )
Mock.Random.float(60, 100);
Mock.mock("@float(60, 100)");

// Mock.Random.float( min, max, dmin )
Mock.Random.float(60, 100, 3);
Mock.mock("@float(60, 100, 3)");

// Mock.Random.float( min, max, dmin, dmax )
Mock.Random.float(60, 100, 3, 5);
Mock.mock("@float(60, 100, 3, 5)");

// Mock.Random.character()
Mock.Random.character();
Mock.mock("@character");
Mock.mock("@character()");

// Mock.Random.character( 'lower/upper/number/symbol' )
Mock.Random.character("lower");
Mock.Random.character("upper");
Mock.Random.character("number");
Mock.Random.character("symbol");

Mock.mock('@character("lower")');
Mock.mock('@character("upper")');
Mock.mock('@character("number")');
Mock.mock('@character("symbol")');

// Mock.Random.character( pool )
Mock.Random.character("aeiou");
Mock.mock('@character("aeiou")');
// Mock.Random.string()
Mock.Random.string();
Mock.mock("@string");
Mock.mock("@string()");

// Mock.Random.string( length )
Mock.Random.string(5);
Mock.mock("@string(5)");

// Mock.Random.string( pool, length )
Mock.Random.string("lower", 5);
Mock.Random.string("upper", 5);
Mock.Random.string("number", 5);
Mock.Random.string("symbol", 5);
Mock.Random.string("aeiou", 5);

Mock.mock('@string("lower", 5)');
Mock.mock('@string("upper", 5)');
Mock.mock('@string("number", 5)');
Mock.mock('@string("symbol", 5)');
Mock.mock('@string("aeiou", 5)');

// Mock.Random.string( min, max )
Mock.Random.string(7, 10);
Mock.mock("@string(7, 10)");

// Mock.Random.string( pool, min, max )
Mock.Random.string("lower", 1, 3);
Mock.Random.string("upper", 1, 3);
Mock.Random.string("number", 1, 3);
Mock.Random.string("symbol", 1, 3);
Mock.Random.string("aeiou", 1, 3);

Mock.mock('@string("lower", 1, 3)');
Mock.mock('@string("upper", 1, 3)');
Mock.mock('@string("number", 1, 3)');
Mock.mock('@string("symbol", 1, 3)');
Mock.mock('@string("aeiou", 1, 3)');

// Mock.Random.range( stop )
Mock.Random.range(10);
Mock.mock("@range(10)");

// Mock.Random.range( start, stop )
Mock.Random.range(3, 7);
Mock.mock("@range(3, 7)");

// Mock.Random.range( start, stop, step )
Mock.Random.range(1, 10, 2);
Mock.Random.range(1, 10, 3);

Mock.mock("@range(1, 10, 2)");
Mock.mock("@range(1, 10, 3)");
// Mock.Random.date()
Mock.Random.date();
Mock.mock("@date");
Mock.mock("@date()");

// Mock.Random.date( format )
Mock.Random.date("yyyy-MM-dd");
Mock.Random.date("yy-MM-dd");
Mock.Random.date("y-MM-dd");
Mock.Random.date("y-M-d");

Mock.mock('@date("yyyy-MM-dd")');
Mock.mock('@date("yy-MM-dd")');
Mock.mock('@date("y-MM-dd")');
Mock.mock('@date("y-M-d")');

Mock.mock('@date("yyyy yy y MM M dd d")');
// Mock.Random.time()
Mock.Random.time();
Mock.mock("@time");
Mock.mock("@time()");

// Mock.Random.time( format )
Mock.Random.time("A HH:mm:ss");
Mock.Random.time("a HH:mm:ss");
Mock.Random.time("HH:mm:ss");
Mock.Random.time("H:m:s");

Mock.mock('@time("A HH:mm:ss")');
Mock.mock('@time("a HH:mm:ss")');
Mock.mock('@time("HH:mm:ss")');
Mock.mock('@time("H:m:s")');

Mock.mock('@datetime("HH H hh h mm m ss s SS S A a T")');
// Mock.Random.datetime()
Mock.Random.datetime();
Mock.mock("@datetime");
Mock.mock("@datetime()");

// Mock.Random.datetime( format )
Mock.Random.datetime("yyyy-MM-dd A HH:mm:ss");
Mock.Random.datetime("yy-MM-dd a HH:mm:ss");
Mock.Random.datetime("y-MM-dd HH:mm:ss");
Mock.Random.datetime("y-M-d H:m:s");

Mock.mock('@datetime("yyyy-MM-dd A HH:mm:ss")');
Mock.mock('@datetime("yy-MM-dd a HH:mm:ss")');
Mock.mock('@datetime("y-MM-dd HH:mm:ss")');
Mock.mock('@datetime("y-M-d H:m:s")');

Mock.mock('@datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")');
// Ranndom.now()
Mock.Random.now();
Mock.mock("@now");
Mock.mock("@now()");

// Ranndom.now( unit )
Mock.Random.now("year");
Mock.Random.now("month");
Mock.Random.now("week");
Mock.Random.now("day");
Mock.Random.now("hour");
Mock.Random.now("minute");
Mock.Random.now("second");

// Ranndom.now( format )
Mock.Random.now("yyyy-MM-dd HH:mm:ss SS");

// Ranndom.now( unit, format )
Mock.Random.now("day", "yyyy-MM-dd HH:mm:ss SS");
// Mock.Random.image()
Mock.Random.image();
// Mock.Random.image( size )
Mock.Random.image("200x100");
// Mock.Random.image( size, background )
Mock.Random.image("200x100", "#FF6600");
// Mock.Random.image( size, background, text )
Mock.Random.image("200x100", "#4A7BF7", "Hello");
// Mock.Random.image( size, background, foreground, text )
Mock.Random.image("200x100", "#50B347", "#FFF", "Mock.js");
// Mock.Random.image( size, background, foreground, format, text )
Mock.Random.image("200x100", "#894FC4", "#FFF", "png", "!");
// Mock.Random.dataImage()
Mock.Random.dataImage();

// Mock.Random.dataImage( size )
Mock.Random.dataImage("200x100");

// Mock.Random.dataImage( size, text )
Mock.Random.dataImage("200x100", "Hello Mock.js!");
// Mock.Random.color()
Mock.Random.color();
Mock.mock("@color");
Mock.mock("@color()");
// Mock.Random.hex()
Mock.Random.hex();
Mock.mock("@hex");
Mock.mock("@hex()");
// Mock.Random.rgb()
Mock.Random.rgb();
Mock.mock("@rgb");
Mock.mock("@rgb()");
// Mock.Random.rgba()
Mock.Random.rgba();
Mock.mock("@rgba");
Mock.mock("@rgba()");
// Mock.Random.hsl()
Mock.Random.hsl();
Mock.mock("@hsl");
Mock.mock("@hsl()");
// Mock.Random.paragraph()
Mock.Random.paragraph();

Mock.mock("@paragraph");

Mock.mock("@paragraph()");

// Mock.Random.paragraph( len )
Mock.Random.paragraph(2);

Mock.mock("@paragraph(2)");

// Mock.Random.paragraph( min, max )
Mock.Random.paragraph(1, 3);

Mock.mock("@paragraph(1, 3)");

// Mock.Random.sentence()
Mock.Random.sentence();
Mock.mock("@sentence");
Mock.mock("@sentence()");

// Mock.Random.sentence( len )
Mock.Random.sentence(5);
Mock.mock("@sentence(5)");

// Mock.Random.sentence( min, max )
Mock.Random.sentence(3, 5);
Mock.mock("@sentence(3, 5)");

// Mock.Random.word()
Mock.Random.word();
Mock.mock("@word");
Mock.mock("@word()");

// Mock.Random.word( len )
Mock.Random.word(5);
Mock.mock("@word(5)");

// Mock.Random.word( min, max )
Mock.Random.word(3, 5);
Mock.mock("@word(3, 5)");

// Mock.Random.title()
Mock.Random.title();
Mock.mock("@title");
Mock.mock("@title()");

// Mock.Random.title( len )
Mock.Random.title(5);
Mock.mock("@title(5)");

// Mock.Random.title( min, max )
Mock.Random.title(3, 5);
Mock.mock("@title(3, 5)");

// Mock.Random.cparagraph()
Mock.Random.cparagraph();

Mock.mock("@cparagraph");

Mock.mock("@cparagraph()");

// Mock.Random.cparagraph( len )
Mock.Random.cparagraph(2);

Mock.mock("@cparagraph(2)");

// Mock.Random.cparagraph( min, max )
Mock.Random.cparagraph(1, 3);

Mock.mock("@cparagraph(1, 3)");

// Mock.Random.csentence()
Mock.Random.csentence();
Mock.mock("@csentence");
Mock.mock("@csentence()");

// Mock.Random.csentence( len )
Mock.Random.csentence(5);
Mock.mock("@csentence(5)");

// Mock.Random.csentence( min, max )
Mock.Random.csentence(3, 5);
Mock.mock("@csentence(3, 5)");

// Mock.Random.cword()
Mock.Random.cword();
Mock.mock("@cword");
Mock.mock("@cword()");

// Mock.Random.cword( pool )
Mock.Random.cword("零一二三四五六七八九十");
Mock.mock('@cword("零一二三四五六七八九十")');

// Mock.Random.cword( length )
Mock.Random.cword(3);
Mock.mock("@cword(3)");

// Mock.Random.cword( pool, length )
Mock.Random.cword("零一二三四五六七八九十", 3);
Mock.mock('@cword("零一二三四五六七八九十", 3)');

// Mock.Random.cword( min, max )
Mock.Random.cword(3, 5);
Mock.mock("@cword(3, 5)");

// Mock.Random.cword( pool, min, max )
Mock.Random.cword("零一二三四五六七八九十", 5, 7);
Mock.mock('@cword("零一二三四五六七八九十", 5, 7)');
// Mock.Random.ctitle()
Mock.Random.ctitle();
Mock.mock("@ctitle");
Mock.mock("@ctitle()");

// Mock.Random.ctitle( len )
Mock.Random.ctitle(5);
Mock.mock("@ctitle(5)");

// Mock.Random.ctitle( min, max )
Mock.Random.ctitle(3, 5);
Mock.mock("@ctitle(3, 5)");

// Mock.Random.first()
Mock.Random.first();
Mock.mock("@first");
Mock.mock("@first()");
// Mock.Random.last()
Mock.Random.last();
Mock.mock("@last");
Mock.mock("@last()");
// Mock.Random.name()
Mock.Random.name();
Mock.mock("@name");
Mock.mock("@name()");

// Mock.Random.name( middle )
Mock.Random.name(true);
Mock.mock("@name(true)");
// Mock.Random.cfirst()
Mock.Random.cfirst();
Mock.mock("@cfirst");
Mock.mock("@cfirst()");
// Mock.Random.clast()
Mock.Random.clast();
Mock.mock("@clast");
Mock.mock("@clast()");
// Mock.Random.cname()
Mock.Random.cname();
Mock.mock("@cname");
Mock.mock("@cname()");
// Mock.Random.url()
Mock.Random.url();
Mock.mock("@url");
Mock.mock("@url()");
// Mock.Random.domain()
Mock.Random.domain();
Mock.mock("@domain");
Mock.mock("@domain()");
// Mock.Random.protocol()
Mock.Random.protocol();
Mock.mock("@protocol");
Mock.mock("@protocol()");
// Mock.Random.tld()
Mock.Random.tld();
Mock.mock("@tld");
Mock.mock("@tld()");
// Mock.Random.email()
Mock.Random.email();
Mock.mock("@email");
Mock.mock("@email()");
// Mock.Random.ip()
Mock.Random.ip();
Mock.mock("@ip");
Mock.mock("@ip()");
// Mock.Random.region()
Mock.Random.region();
Mock.mock("@region");
Mock.mock("@region()");
// Mock.Random.province()
Mock.Random.province();
Mock.mock("@province");
Mock.mock("@province()");
// Mock.Random.city()
Mock.Random.city();
Mock.mock("@city");
Mock.mock("@city()");
// Mock.Random.city( prefix )
Mock.Random.city(true);
Mock.mock("@city(true)");
// Mock.Random.county()
Mock.Random.county();
Mock.mock("@county");
Mock.mock("@county()");
// Mock.Random.county( prefix )
Mock.Random.county(true);
Mock.mock("@county(true)");
// Mock.Random.zip()
Mock.Random.zip();
Mock.mock("@zip");
Mock.mock("@zip()");
// Mock.Random.capitalize( word )
Mock.Random.capitalize("hello");
Mock.mock('@capitalize("hello")');
// Mock.Random.upper( str )
Mock.Random.upper("hello");
Mock.mock('@upper("hello")');
// Mock.Random.lower( str )
Mock.Random.lower("HELLO");
Mock.mock('@lower("HELLO")');
// Mock.Random.pick( arr )
Mock.Random.pick(["a", "e", "i", "o", "u"]);
Mock.mock('@pick(["a", "e", "i", "o", "u"])');
// Mock.Random.shuffle( arr )
Mock.Random.shuffle(["a", "e", "i", "o", "u"]);
Mock.mock('@shuffle(["a", "e", "i", "o", "u"])');
// Mock.Random.guid()
Mock.Random.guid();
Mock.mock("@guid");
Mock.mock("@guid()");
// Mock.Random.id()
Mock.Random.id();
Mock.mock("@id");
Mock.mock("@id()");
// Mock.Random.increment()
Mock.Random.increment();
Mock.mock("@increment");
Mock.mock("@increment()");

// Mock.Random.increment( step )
Mock.Random.increment(100);
Mock.mock("@increment(100)");
Mock.Random.increment(1000);
Mock.mock("@increment(1000)");
