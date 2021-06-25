console.log(
    `.mock({
    "string|1-10": "★",
})`,
    Mock.mock({
        "string|1-10": "★",
    })
);
console.log(
    `.mock({
    "string|3": "★★★",
})`,
    Mock.mock({
        "string|3": "★★★",
    })
);
console.log(
    `.mock({
    "number|+1": 202,
})`,
    Mock.mock({
        "number|+1": 202,
    })
);
console.log(
    `.mock({
    "number|1-100": 100,
})`,
    Mock.mock({
        "number|1-100": 100,
    })
);
console.log(
    `.mock({
    "number|1-100.1-10": 1,
})`,
    Mock.mock({
        "number|1-100.1-10": 1,
    })
);
console.log(
    `.mock({
    "number|123.1-10": 1,
})`,
    Mock.mock({
        "number|123.1-10": 1,
    })
);
console.log(
    `.mock({
    "number|123.3": 1,
})`,
    Mock.mock({
        "number|123.3": 1,
    })
);
console.log(
    `.mock({
    "number|123.10": 1.123,
})`,
    Mock.mock({
        "number|123.10": 1.123,
    })
);
console.log(
    `.mock({
    "boolean|1": true,
})`,
    Mock.mock({
        "boolean|1": true,
    })
);
console.log(
    `.mock({
    "boolean|1-2": true,
})`,
    Mock.mock({
        "boolean|1-2": true,
    })
);
console.log(
    `.mock({
    "object|2": {
        310000: "上海市",
        320000: "江苏省",
        330000: "浙江省",
        340000: "安徽省",
    },
})`,
    Mock.mock({
        "object|2": {
            310000: "上海市",
            320000: "江苏省",
            330000: "浙江省",
            340000: "安徽省",
        },
    })
);
console.log(
    `.mock({
    "object|2-4": {
        110000: "北京市",
        120000: "天津市",
        130000: "河北省",
        140000: "山西省",
    },
})`,
    Mock.mock({
        "object|2-4": {
            110000: "北京市",
            120000: "天津市",
            130000: "河北省",
            140000: "山西省",
        },
    })
);
console.log(
    `.mock({
    "array|1": ["AMD", "CMD", "UMD"],
})`,
    Mock.mock({
        "array|1": ["AMD", "CMD", "UMD"],
    })
);
console.log(
    `.mock({
    "array|+1": ["AMD", "CMD", "UMD"],
})`,
    Mock.mock({
        "array|+1": ["AMD", "CMD", "UMD"],
    })
);
console.log(
    `.mock({
    "array|1-10": [
        {
            "name|+1": ["Hello", "Mock.js", "!"],
        },
    ],
})`,
    Mock.mock({
        "array|1-10": [
            {
                "name|+1": ["Hello", "Mock.js", "!"],
            },
        ],
    })
);
console.log(
    `.mock({
    "array|1-10": ["Mock.js"],
})`,
    Mock.mock({
        "array|1-10": ["Mock.js"],
    })
);
console.log(
    `.mock({
    "array|1-10": ["Hello", "Mock.js", "!"],
})`,
    Mock.mock({
        "array|1-10": ["Hello", "Mock.js", "!"],
    })
);
console.log(
    `.mock({
    "array|3": ["Mock.js"],
})`,
    Mock.mock({
        "array|3": ["Mock.js"],
    })
);
console.log(
    `.mock({
    "array|3": ["Hello", "Mock.js", "!"],
})`,
    Mock.mock({
        "array|3": ["Hello", "Mock.js", "!"],
    })
);

console.log(
    `.mock({
    regexp: /[a-z][A-Z][0-9]/,
})`,
    Mock.mock({
        regexp: /[a-z][A-Z][0-9]/,
    })
);
console.log(
    `.mock({
    regexp: /\w\W\s\S\d\D/,
})`,
    Mock.mock({
        regexp: /\w\W\s\S\d\D/,
    })
);
console.log(
    `.mock({
    regexp: /\d{5,10}/,
})`,
    Mock.mock({
        regexp: /\d{5,10}/,
    })
);
console.log(
    `.mock({
    "regexp|3": /\d{5,10}\-/,
})`,
    Mock.mock({
        "regexp|3": /\d{5,10}\-/,
    })
);
console.log(
    `.mock({
    "regexp|1-5": /\d{5,10}\-/,
})`,
    Mock.mock({
        "regexp|1-5": /\d{5,10}\-/,
    })
);
console.log(
    `.mock({
    foo: "Hello",
    nested: {
        a: {
            b: {
                c: "Mock.js",
            },
        },
    },
    absolutePath: "@/foo @/nested/a/b/c",
})`,
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
    })
);
console.log(
    `.mock({
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
})`,
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
    })
);
// Mock.Random.boolean()
console.log(`.Random.boolean()`, Mock.Random.boolean());
console.log(`.mock("@boolean")`, Mock.mock("@boolean"));
console.log(`.mock("@boolean()")`, Mock.mock("@boolean()"));

// Mock.Random.boolean( min, max, current )
console.log(`.Random.boolean(1, 9, true)`, Mock.Random.boolean(1, 9, true));
console.log(`.mock("@boolean(1, 9, true)")`, Mock.mock("@boolean(1, 9, true)"));
// Mock.Random.natural()
console.log(`.Random.natural()`, Mock.Random.natural());
console.log(`.mock("@natural")`, Mock.mock("@natural"));
console.log(`.mock("@natural()")`, Mock.mock("@natural()"));

// Mock.Random.natural( min )
console.log(`.Random.natural(10000)`, Mock.Random.natural(10000));
console.log(`.mock("@natural(10000)")`, Mock.mock("@natural(10000)"));

// Mock.Random.natural( min, max )
console.log(`.Random.natural(60, 100)`, Mock.Random.natural(60, 100));
console.log(`.mock("@natural(60, 100)")`, Mock.mock("@natural(60, 100)"));
// Mock.Random.integer()
console.log(`.Random.integer()`, Mock.Random.integer());
console.log(`.mock("@integer")`, Mock.mock("@integer"));
console.log(`.mock("@integer()")`, Mock.mock("@integer()"));

// Mock.Random.integer( min )
console.log(`.Random.integer(10000)`, Mock.Random.integer(10000));
console.log(`.mock("@integer(10000)")`, Mock.mock("@integer(10000)"));

// Mock.Random.integer( min, max )
console.log(`.Random.integer(60, 100)`, Mock.Random.integer(60, 100));
console.log(`.mock("@integer(60, 100)")`, Mock.mock("@integer(60, 100)"));
// Mock.Random.float()
console.log(`.Random.float()`, Mock.Random.float());
console.log(`.mock("@float")`, Mock.mock("@float"));
console.log(`.mock("@float()")`, Mock.mock("@float()"));

// Mock.Random.float( min )
console.log(`.Random.float(0)`, Mock.Random.float(0));
console.log(`.mock("@float(0)")`, Mock.mock("@float(0)"));

// Mock.Random.float( min, max )
console.log(`.Random.float(60, 100)`, Mock.Random.float(60, 100));
console.log(`.mock("@float(60, 100)")`, Mock.mock("@float(60, 100)"));

// Mock.Random.float( min, max, dmin )
console.log(`.Random.float(60, 100, 3)`, Mock.Random.float(60, 100, 3));
console.log(`.mock("@float(60, 100, 3)")`, Mock.mock("@float(60, 100, 3)"));

// Mock.Random.float( min, max, dmin, dmax )
console.log(`.Random.float(60, 100, 3, 5)`, Mock.Random.float(60, 100, 3, 5));
console.log(`.mock("@float(60, 100, 3, 5)")`, Mock.mock("@float(60, 100, 3, 5)"));

// Mock.Random.character()
console.log(`.Random.character()`, Mock.Random.character());
console.log(`.mock("@character")`, Mock.mock("@character"));
console.log(`.mock("@character()")`, Mock.mock("@character()"));

// Mock.Random.character( 'lower/upper/number/symbol' )
console.log(`.Random.character("lower")`, Mock.Random.character("lower"));
console.log(`.Random.character("upper")`, Mock.Random.character("upper"));
console.log(`.Random.character("number")`, Mock.Random.character("number"));
console.log(`.Random.character("symbol")`, Mock.Random.character("symbol"));

console.log(`.mock('@character("lower")')`, Mock.mock('@character("lower")'));
console.log(`.mock('@character("upper")')`, Mock.mock('@character("upper")'));
console.log(`.mock('@character("number")')`, Mock.mock('@character("number")'));
console.log(`.mock('@character("symbol")')`, Mock.mock('@character("symbol")'));

// Mock.Random.character( pool )
console.log(`.Random.character("aeiou")`, Mock.Random.character("aeiou"));
console.log(`.mock('@character("aeiou")')`, Mock.mock('@character("aeiou")'));
// Mock.Random.string()
console.log(`.Random.string()`, Mock.Random.string());
console.log(`.mock("@string")`, Mock.mock("@string"));
console.log(`.mock("@string()")`, Mock.mock("@string()"));

// Mock.Random.string( length )
console.log(`.Random.string(5)`, Mock.Random.string(5));
console.log(`.mock("@string(5)")`, Mock.mock("@string(5)"));

// Mock.Random.string( pool, length )
console.log(`.Random.string("lower", 5)`, Mock.Random.string("lower", 5));
console.log(`.Random.string("upper", 5)`, Mock.Random.string("upper", 5));
console.log(`.Random.string("number", 5)`, Mock.Random.string("number", 5));
console.log(`.Random.string("symbol", 5)`, Mock.Random.string("symbol", 5));
console.log(`.Random.string("aeiou", 5)`, Mock.Random.string("aeiou", 5));

console.log(`.mock('@string("lower", 5)')`, Mock.mock('@string("lower", 5)'));
console.log(`.mock('@string("upper", 5)')`, Mock.mock('@string("upper", 5)'));
console.log(`.mock('@string("number", 5)')`, Mock.mock('@string("number", 5)'));
console.log(`.mock('@string("symbol", 5)')`, Mock.mock('@string("symbol", 5)'));
console.log(`.mock('@string("aeiou", 5)')`, Mock.mock('@string("aeiou", 5)'));

// Mock.Random.string( min, max )
console.log(`.Random.string(7, 10)`, Mock.Random.string(7, 10));
console.log(`.mock("@string(7, 10)")`, Mock.mock("@string(7, 10)"));

// Mock.Random.string( pool, min, max )
console.log(`.Random.string("lower", 1, 3)`, Mock.Random.string("lower", 1, 3));
console.log(`.Random.string("upper", 1, 3)`, Mock.Random.string("upper", 1, 3));
console.log(`.Random.string("number", 1, 3)`, Mock.Random.string("number", 1, 3));
console.log(`.Random.string("symbol", 1, 3)`, Mock.Random.string("symbol", 1, 3));
console.log(`.Random.string("aeiou", 1, 3)`, Mock.Random.string("aeiou", 1, 3));

console.log(`.mock('@string("lower", 1, 3)')`, Mock.mock('@string("lower", 1, 3)'));
console.log(`.mock('@string("upper", 1, 3)')`, Mock.mock('@string("upper", 1, 3)'));
console.log(`.mock('@string("number", 1, 3)')`, Mock.mock('@string("number", 1, 3)'));
console.log(`.mock('@string("symbol", 1, 3)')`, Mock.mock('@string("symbol", 1, 3)'));
console.log(`.mock('@string("aeiou", 1, 3)')`, Mock.mock('@string("aeiou", 1, 3)'));

// Mock.Random.range( stop )
console.log(`.Random.range(10)`, Mock.Random.range(10));
console.log(`.mock("@range(10)")`, Mock.mock("@range(10)"));

// Mock.Random.range( start, stop )
console.log(`.Random.range(3, 7)`, Mock.Random.range(3, 7));
console.log(`.mock("@range(3, 7)")`, Mock.mock("@range(3, 7)"));

// Mock.Random.range( start, stop, step )
console.log(`.Random.range(1, 10, 2)`, Mock.Random.range(1, 10, 2));
console.log(`.Random.range(1, 10, 3)`, Mock.Random.range(1, 10, 3));

console.log(`.mock("@range(1, 10, 2)")`, Mock.mock("@range(1, 10, 2)"));
console.log(`.mock("@range(1, 10, 3)")`, Mock.mock("@range(1, 10, 3)"));
// Mock.Random.date()
console.log(`.Random.date()`, Mock.Random.date());
console.log(`.mock("@date")`, Mock.mock("@date"));
console.log(`.mock("@date()")`, Mock.mock("@date()"));

// Mock.Random.date( format )
console.log(`.Random.date("yyyy-MM-dd")`, Mock.Random.date("yyyy-MM-dd"));
console.log(`.Random.date("yy-MM-dd")`, Mock.Random.date("yy-MM-dd"));
console.log(`.Random.date("y-MM-dd")`, Mock.Random.date("y-MM-dd"));
console.log(`.Random.date("y-M-d")`, Mock.Random.date("y-M-d"));

console.log(`.mock('@date("yyyy-MM-dd")')`, Mock.mock('@date("yyyy-MM-dd")'));
console.log(`.mock('@date("yy-MM-dd")')`, Mock.mock('@date("yy-MM-dd")'));
console.log(`.mock('@date("y-MM-dd")')`, Mock.mock('@date("y-MM-dd")'));
console.log(`.mock('@date("y-M-d")')`, Mock.mock('@date("y-M-d")'));

console.log(`.mock('@date("yyyy yy y MM M dd d")')`, Mock.mock('@date("yyyy yy y MM M dd d")'));
// Mock.Random.time()
console.log(`.Random.time()`, Mock.Random.time());
console.log(`.mock("@time")`, Mock.mock("@time"));
console.log(`.mock("@time()")`, Mock.mock("@time()"));

// Mock.Random.time( format )
console.log(`.Random.time("A HH:mm:ss")`, Mock.Random.time("A HH:mm:ss"));
console.log(`.Random.time("a HH:mm:ss")`, Mock.Random.time("a HH:mm:ss"));
console.log(`.Random.time("HH:mm:ss")`, Mock.Random.time("HH:mm:ss"));
console.log(`.Random.time("H:m:s")`, Mock.Random.time("H:m:s"));

console.log(`.mock('@time("A HH:mm:ss")')`, Mock.mock('@time("A HH:mm:ss")'));
console.log(`.mock('@time("a HH:mm:ss")')`, Mock.mock('@time("a HH:mm:ss")'));
console.log(`.mock('@time("HH:mm:ss")')`, Mock.mock('@time("HH:mm:ss")'));
console.log(`.mock('@time("H:m:s")')`, Mock.mock('@time("H:m:s")'));

console.log(`.mock('@datetime("HH H hh h mm m ss s SS S A a T")')`, Mock.mock('@datetime("HH H hh h mm m ss s SS S A a T")'));
// Mock.Random.datetime()
console.log(`.Random.datetime()`, Mock.Random.datetime());
console.log(`.mock("@datetime")`, Mock.mock("@datetime"));
console.log(`.mock("@datetime()")`, Mock.mock("@datetime()"));

// Mock.Random.datetime( format )
console.log(`.Random.datetime("yyyy-MM-dd A HH:mm:ss")`, Mock.Random.datetime("yyyy-MM-dd A HH:mm:ss"));
console.log(`.Random.datetime("yy-MM-dd a HH:mm:ss")`, Mock.Random.datetime("yy-MM-dd a HH:mm:ss"));
console.log(`.Random.datetime("y-MM-dd HH:mm:ss")`, Mock.Random.datetime("y-MM-dd HH:mm:ss"));
console.log(`.Random.datetime("y-M-d H:m:s")`, Mock.Random.datetime("y-M-d H:m:s"));

console.log(`.mock('@datetime("yyyy-MM-dd A HH:mm:ss")')`, Mock.mock('@datetime("yyyy-MM-dd A HH:mm:ss")'));
console.log(`.mock('@datetime("yy-MM-dd a HH:mm:ss")')`, Mock.mock('@datetime("yy-MM-dd a HH:mm:ss")'));
console.log(`.mock('@datetime("y-MM-dd HH:mm:ss")')`, Mock.mock('@datetime("y-MM-dd HH:mm:ss")'));
console.log(`.mock('@datetime("y-M-d H:m:s")')`, Mock.mock('@datetime("y-M-d H:m:s")'));

console.log(`.mock('@datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")')`, Mock.mock('@datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")'));
// Ranndom.now()
console.log(`.Random.now()`, Mock.Random.now());
console.log(`.mock("@now")`, Mock.mock("@now"));
console.log(`.mock("@now()")`, Mock.mock("@now()"));

// Ranndom.now( unit )
console.log(`.Random.now("year")`, Mock.Random.now("year"));
console.log(`.Random.now("month")`, Mock.Random.now("month"));
console.log(`.Random.now("week")`, Mock.Random.now("week"));
console.log(`.Random.now("day")`, Mock.Random.now("day"));
console.log(`.Random.now("hour")`, Mock.Random.now("hour"));
console.log(`.Random.now("minute")`, Mock.Random.now("minute"));
console.log(`.Random.now("second")`, Mock.Random.now("second"));

// Ranndom.now( format )
console.log(`.Random.now("yyyy-MM-dd HH:mm:ss SS")`, Mock.Random.now("yyyy-MM-dd HH:mm:ss SS"));

// Ranndom.now( unit, format )
console.log(`.Random.now("day", "yyyy-MM-dd HH:mm:ss SS")`, Mock.Random.now("day", "yyyy-MM-dd HH:mm:ss SS"));
// Mock.Random.image()
console.log(`.Random.image()`, Mock.Random.image());
// Mock.Random.image( size )
console.log(`.Random.image("200x100")`, Mock.Random.image("200x100"));
// Mock.Random.image( size, background )
console.log(`.Random.image("200x100", "#FF6600")`, Mock.Random.image("200x100", "#FF6600"));
// Mock.Random.image( size, background, text )
console.log(`.Random.image("200x100", "#4A7BF7", "Hello")`, Mock.Random.image("200x100", "#4A7BF7", "Hello"));
// Mock.Random.image( size, background, foreground, text )
console.log(`.Random.image("200x100", "#50B347", "#FFF", "Mock.js")`, Mock.Random.image("200x100", "#50B347", "#FFF", "Mock.js"));
// Mock.Random.image( size, background, foreground, format, text )
console.log(`.Random.image("200x100", "#894FC4", "#FFF", "png", "!")`, Mock.Random.image("200x100", "#894FC4", "#FFF", "png", "!"));
// Mock.Random.dataImage()
console.log(`.Random.dataImage()`, Mock.Random.dataImage());

// Mock.Random.dataImage( size )
console.log(`.Random.dataImage("200x100")`, Mock.Random.dataImage("200x100"));

// Mock.Random.dataImage( size, text )
console.log(`.Random.dataImage("200x100", "Hello Mock.js!")`, Mock.Random.dataImage("200x100", "Hello Mock.js!"));
// Mock.Random.color()
console.log(`.Random.color()`, Mock.Random.color());
console.log(`.mock("@color")`, Mock.mock("@color"));
console.log(`.mock("@color()")`, Mock.mock("@color()"));
// Mock.Random.hex()
console.log(`.Random.hex()`, Mock.Random.hex());
console.log(`.mock("@hex")`, Mock.mock("@hex"));
console.log(`.mock("@hex()")`, Mock.mock("@hex()"));
// Mock.Random.rgb()
console.log(`.Random.rgb()`, Mock.Random.rgb());
console.log(`.mock("@rgb")`, Mock.mock("@rgb"));
console.log(`.mock("@rgb()")`, Mock.mock("@rgb()"));
// Mock.Random.rgba()
console.log(`.Random.rgba()`, Mock.Random.rgba());
console.log(`.mock("@rgba")`, Mock.mock("@rgba"));
console.log(`.mock("@rgba()")`, Mock.mock("@rgba()"));
// Mock.Random.hsl()
console.log(`.Random.hsl()`, Mock.Random.hsl());
console.log(`.mock("@hsl")`, Mock.mock("@hsl"));
console.log(`.mock("@hsl()")`, Mock.mock("@hsl()"));
// Mock.Random.paragraph()
console.log(`.Random.paragraph()`, Mock.Random.paragraph());

console.log(`.mock("@paragraph")`, Mock.mock("@paragraph"));

console.log(`.mock("@paragraph()")`, Mock.mock("@paragraph()"));

// Mock.Random.paragraph( len )
console.log(`.Random.paragraph(2)`, Mock.Random.paragraph(2));

console.log(`.mock("@paragraph(2)")`, Mock.mock("@paragraph(2)"));

// Mock.Random.paragraph( min, max )
console.log(`.Random.paragraph(1, 3)`, Mock.Random.paragraph(1, 3));

console.log(`.mock("@paragraph(1, 3)")`, Mock.mock("@paragraph(1, 3)"));

// Mock.Random.sentence()
console.log(`.Random.sentence()`, Mock.Random.sentence());
console.log(`.mock("@sentence")`, Mock.mock("@sentence"));
console.log(`.mock("@sentence()")`, Mock.mock("@sentence()"));

// Mock.Random.sentence( len )
console.log(`.Random.sentence(5)`, Mock.Random.sentence(5));
console.log(`.mock("@sentence(5)")`, Mock.mock("@sentence(5)"));

// Mock.Random.sentence( min, max )
console.log(`.Random.sentence(3, 5)`, Mock.Random.sentence(3, 5));
console.log(`.mock("@sentence(3, 5)")`, Mock.mock("@sentence(3, 5)"));

// Mock.Random.word()
console.log(`.Random.word()`, Mock.Random.word());
console.log(`.mock("@word")`, Mock.mock("@word"));
console.log(`.mock("@word()")`, Mock.mock("@word()"));

// Mock.Random.word( len )
console.log(`.Random.word(5)`, Mock.Random.word(5));
console.log(`.mock("@word(5)")`, Mock.mock("@word(5)"));

// Mock.Random.word( min, max )
console.log(`.Random.word(3, 5)`, Mock.Random.word(3, 5));
console.log(`.mock("@word(3, 5)")`, Mock.mock("@word(3, 5)"));

// Mock.Random.title()
console.log(`.Random.title()`, Mock.Random.title());
console.log(`.mock("@title")`, Mock.mock("@title"));
console.log(`.mock("@title()")`, Mock.mock("@title()"));

// Mock.Random.title( len )
console.log(`.Random.title(5)`, Mock.Random.title(5));
console.log(`.mock("@title(5)")`, Mock.mock("@title(5)"));

// Mock.Random.title( min, max )
console.log(`.Random.title(3, 5)`, Mock.Random.title(3, 5));
console.log(`.mock("@title(3, 5)")`, Mock.mock("@title(3, 5)"));

// Mock.Random.cparagraph()
console.log(`.Random.cparagraph()`, Mock.Random.cparagraph());

console.log(`.mock("@cparagraph")`, Mock.mock("@cparagraph"));

console.log(`.mock("@cparagraph()")`, Mock.mock("@cparagraph()"));

// Mock.Random.cparagraph( len )
console.log(`.Random.cparagraph(2)`, Mock.Random.cparagraph(2));

console.log(`.mock("@cparagraph(2)")`, Mock.mock("@cparagraph(2)"));

// Mock.Random.cparagraph( min, max )
console.log(`.Random.cparagraph(1, 3)`, Mock.Random.cparagraph(1, 3));

console.log(`.mock("@cparagraph(1, 3)")`, Mock.mock("@cparagraph(1, 3)"));

// Mock.Random.csentence()
console.log(`.Random.csentence()`, Mock.Random.csentence());
console.log(`.mock("@csentence")`, Mock.mock("@csentence"));
console.log(`.mock("@csentence()")`, Mock.mock("@csentence()"));

// Mock.Random.csentence( len )
console.log(`.Random.csentence(5)`, Mock.Random.csentence(5));
console.log(`.mock("@csentence(5)")`, Mock.mock("@csentence(5)"));

// Mock.Random.csentence( min, max )
console.log(`.Random.csentence(3, 5)`, Mock.Random.csentence(3, 5));
console.log(`.mock("@csentence(3, 5)")`, Mock.mock("@csentence(3, 5)"));

// Mock.Random.cword()
console.log(`.Random.cword()`, Mock.Random.cword());
console.log(`.mock("@cword")`, Mock.mock("@cword"));
console.log(`.mock("@cword()")`, Mock.mock("@cword()"));

// Mock.Random.cword( pool )
console.log(`.Random.cword("零一二三四五六七八九十")`, Mock.Random.cword("零一二三四五六七八九十"));
console.log(`.mock('@cword("零一二三四五六七八九十")')`, Mock.mock('@cword("零一二三四五六七八九十")'));

// Mock.Random.cword( length )
console.log(`.Random.cword(3)`, Mock.Random.cword(3));
console.log(`.mock("@cword(3)")`, Mock.mock("@cword(3)"));

// Mock.Random.cword( pool, length )
console.log(`.Random.cword("零一二三四五六七八九十", 3)`, Mock.Random.cword("零一二三四五六七八九十", 3));
console.log(`.mock('@cword("零一二三四五六七八九十", 3)')`, Mock.mock('@cword("零一二三四五六七八九十", 3)'));

// Mock.Random.cword( min, max )
console.log(`.Random.cword(3, 5)`, Mock.Random.cword(3, 5));
console.log(`.mock("@cword(3, 5)")`, Mock.mock("@cword(3, 5)"));

// Mock.Random.cword( pool, min, max )
console.log(`.Random.cword("零一二三四五六七八九十", 5, 7)`, Mock.Random.cword("零一二三四五六七八九十", 5, 7));
console.log(`.mock('@cword("零一二三四五六七八九十", 5, 7)')`, Mock.mock('@cword("零一二三四五六七八九十", 5, 7)'));
// Mock.Random.ctitle()
console.log(`.Random.ctitle()`, Mock.Random.ctitle());
console.log(`.mock("@ctitle")`, Mock.mock("@ctitle"));
console.log(`.mock("@ctitle()")`, Mock.mock("@ctitle()"));

// Mock.Random.ctitle( len )
console.log(`.Random.ctitle(5)`, Mock.Random.ctitle(5));
console.log(`.mock("@ctitle(5)")`, Mock.mock("@ctitle(5)"));

// Mock.Random.ctitle( min, max )
console.log(`.Random.ctitle(3, 5)`, Mock.Random.ctitle(3, 5));
console.log(`.mock("@ctitle(3, 5)")`, Mock.mock("@ctitle(3, 5)"));

// Mock.Random.first()
console.log(`.Random.first()`, Mock.Random.first());
console.log(`.mock("@first")`, Mock.mock("@first"));
console.log(`.mock("@first()")`, Mock.mock("@first()"));
// Mock.Random.last()
console.log(`.Random.last()`, Mock.Random.last());
console.log(`.mock("@last")`, Mock.mock("@last"));
console.log(`.mock("@last()")`, Mock.mock("@last()"));
// Mock.Random.name()
console.log(`.Random.name()`, Mock.Random.name());
console.log(`.mock("@name")`, Mock.mock("@name"));
console.log(`.mock("@name()")`, Mock.mock("@name()"));

// Mock.Random.name( middle )
console.log(`.Random.name(true)`, Mock.Random.name(true));
console.log(`.mock("@name(true)")`, Mock.mock("@name(true)"));
// Mock.Random.cfirst()
console.log(`.Random.cfirst()`, Mock.Random.cfirst());
console.log(`.mock("@cfirst")`, Mock.mock("@cfirst"));
console.log(`.mock("@cfirst()")`, Mock.mock("@cfirst()"));
// Mock.Random.clast()
console.log(`.Random.clast()`, Mock.Random.clast());
console.log(`.mock("@clast")`, Mock.mock("@clast"));
console.log(`.mock("@clast()")`, Mock.mock("@clast()"));
// Mock.Random.cname()
console.log(`.Random.cname()`, Mock.Random.cname());
console.log(`.mock("@cname")`, Mock.mock("@cname"));
console.log(`.mock("@cname()")`, Mock.mock("@cname()"));
// Mock.Random.url()
console.log(`.Random.url()`, Mock.Random.url());
console.log(`.mock("@url")`, Mock.mock("@url"));
console.log(`.mock("@url()")`, Mock.mock("@url()"));
// Mock.Random.domain()
console.log(`.Random.domain()`, Mock.Random.domain());
console.log(`.mock("@domain")`, Mock.mock("@domain"));
console.log(`.mock("@domain()")`, Mock.mock("@domain()"));
// Mock.Random.protocol()
console.log(`.Random.protocol()`, Mock.Random.protocol());
console.log(`.mock("@protocol")`, Mock.mock("@protocol"));
console.log(`.mock("@protocol()")`, Mock.mock("@protocol()"));
// Mock.Random.tld()
console.log(`.Random.tld()`, Mock.Random.tld());
console.log(`.mock("@tld")`, Mock.mock("@tld"));
console.log(`.mock("@tld()")`, Mock.mock("@tld()"));
// Mock.Random.email()
console.log(`.Random.email()`, Mock.Random.email());
console.log(`.mock("@email")`, Mock.mock("@email"));
console.log(`.mock("@email()")`, Mock.mock("@email()"));
// Mock.Random.ip()
console.log(`.Random.ip()`, Mock.Random.ip());
console.log(`.mock("@ip")`, Mock.mock("@ip"));
console.log(`.mock("@ip()")`, Mock.mock("@ip()"));
// Mock.Random.region()
console.log(`.Random.region()`, Mock.Random.region());
console.log(`.mock("@region")`, Mock.mock("@region"));
console.log(`.mock("@region()")`, Mock.mock("@region()"));
// Mock.Random.province()
console.log(`.Random.province()`, Mock.Random.province());
console.log(`.mock("@province")`, Mock.mock("@province"));
console.log(`.mock("@province()")`, Mock.mock("@province()"));
// Mock.Random.city()
console.log(`.Random.city()`, Mock.Random.city());
console.log(`.mock("@city")`, Mock.mock("@city"));
console.log(`.mock("@city()")`, Mock.mock("@city()"));
// Mock.Random.city( prefix )
console.log(`.Random.city(true)`, Mock.Random.city(true));
console.log(`.mock("@city(true)")`, Mock.mock("@city(true)"));
// Mock.Random.county()
console.log(`.Random.county()`, Mock.Random.county());
console.log(`.mock("@county")`, Mock.mock("@county"));
console.log(`.mock("@county()")`, Mock.mock("@county()"));
// Mock.Random.county( prefix )
console.log(`.Random.county(true)`, Mock.Random.county(true));
console.log(`.mock("@county(true)")`, Mock.mock("@county(true)"));
// Mock.Random.zip()
console.log(`.Random.zip()`, Mock.Random.zip());
console.log(`.mock("@zip")`, Mock.mock("@zip"));
console.log(`.mock("@zip()")`, Mock.mock("@zip()"));
// Mock.Random.capitalize( word )
console.log(`.Random.capitalize("hello")`, Mock.Random.capitalize("hello"));
console.log(`.mock('@capitalize("hello")')`, Mock.mock('@capitalize("hello")'));
// Mock.Random.upper( str )
console.log(`.Random.upper("hello")`, Mock.Random.upper("hello"));
console.log(`.mock('@upper("hello")')`, Mock.mock('@upper("hello")'));
// Mock.Random.lower( str )
console.log(`.Random.lower("HELLO")`, Mock.Random.lower("HELLO"));
console.log(`.mock('@lower("HELLO")')`, Mock.mock('@lower("HELLO")'));
// Mock.Random.pick( arr )
console.log(`.Random.pick(["a", "e", "i", "o", "u"])`, Mock.Random.pick(["a", "e", "i", "o", "u"]));
console.log(`.mock('@pick(["a", "e", "i", "o", "u"])')`, Mock.mock('@pick(["a", "e", "i", "o", "u"])'));
// Mock.Random.shuffle( arr )
console.log(`.Random.shuffle(["a", "e", "i", "o", "u"])`, Mock.Random.shuffle(["a", "e", "i", "o", "u"]));
console.log(`.mock('@shuffle(["a", "e", "i", "o", "u"])')`, Mock.mock('@shuffle(["a", "e", "i", "o", "u"])'));
// Mock.Random.guid()
console.log(`.Random.guid()`, Mock.Random.guid());
console.log(`.mock("@guid")`, Mock.mock("@guid"));
console.log(`.mock("@guid()")`, Mock.mock("@guid()"));
// Mock.Random.id()
console.log(`.Random.id()`, Mock.Random.id());
console.log(`.mock("@id")`, Mock.mock("@id"));
console.log(`.mock("@id()")`, Mock.mock("@id()"));
// Mock.Random.increment()
console.log(`.Random.increment()`, Mock.Random.increment());
console.log(`.mock("@increment")`, Mock.mock("@increment"));
console.log(`.mock("@increment()")`, Mock.mock("@increment()"));

// Mock.Random.increment( step )
console.log(`.Random.increment(100)`, Mock.Random.increment(100));
console.log(`.mock("@increment(100)")`, Mock.mock("@increment(100)"));
console.log(`.Random.increment(1000)`, Mock.Random.increment(1000));
console.log(`.mock("@increment(1000)")`, Mock.mock("@increment(1000)"));
