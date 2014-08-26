module('RegExr')

/*
    按照 http://www.regexr.com/ 的 Reference 设计测试用例。
*/

if(!window.RegExpParser){
    window.RegExpParser = Mock.RegExpParser
    window.RegExpHandler = Mock.RegExpHandler
}

function doRegExr(regexp) {
    if (arguments.length > 1) {
        _.each(arguments, function(item, index) {
            doRegExr(item)
        })
    }
    var ast = RegExpParser.parse(regexp.source)
    var data = RegExpHandler.gen(ast)
    ok(
        regexp.test(data),
        regexp.toString() + ' => ' + data
    )
}

// 字符类
test('Character Classes', function() {
    doRegExr(/./)
    doRegExr(
        /[a-z]/,
        /[A-Z]/,
        /[0-9]/
    )
    doRegExr(
        /\w/,
        /\W/,
        /\s/,
        /\S/,
        /\d/,
        /\D/
    )
    doRegExr(
        /[.]/,
        /[\w]/,
        /[\W]/,
        /[\s]/,
        /[\S]/,
        /[\d]/,
        /[\D]/
    )
    doRegExr(
        /[^.]/,
        /[^\w]/,
        /[^\W]/,
        /[^\s]/,
        /[^\S]/,
        /[^\d]/,
        /[^\D]/
    )
})
// 
test('Quantifiers', function() {
    doRegExr(
        /\d?/,
        /\d+/,
        /\d*/
    )
    // {n}, {n,}, {n,m}, {0,1} ?, {1,0} +, {0,} *
    doRegExr(
        /\d{5}/,
        /\d{5,}/,
        /\d{5,10}/,
        /\d{0,1}/,
        /\d{0,}/
    )

    try {
        // /\d{1,0}/
    } catch (exception) {
        // JavaScript 不支持 {1,0}
        // ok(exception, exception.message)
    }
})
test('Anchors', function() {
    doRegExr(/^/)
    doRegExr(/$/)
    doRegExr(/\bfoo/)
    doRegExr(/\Bfoo/)
})
test('Escaped Characters', function() {
    doRegExr(/\000/)
    doRegExr(/\xFF/)
    doRegExr(/\uFFFF/)
    doRegExr(/\cI/)
})
test('Groups & Lookaround', function() {
    doRegExr(/(ABC)/)
    doRegExr(/(ABC)\1/)
    doRegExr(/(?:ABC)/)
    doRegExr(/(?=ABC)/)
    doRegExr(/(?!ABC)/)
    // doRegExr(/(?<=ABC)/)
    // doRegExr(/(?<!ABC)/)
})
test('Quantifiers & Alternation', function() {
    doRegExr(/.+/)
    doRegExr(/.*/)
    doRegExr(/.{1,3}/)
    doRegExr(/.?/)
    doRegExr(/a|bc/)
})
test('Flags ', function() {
    expect(0)
    // ignoreCase
    // multiline
    // global
})

;
(function() {
    // from http://www.regexr.com/
    return {
        label: "Reference",
        id: "reference",
        icon: "&#xE072;",
        desc: "Information on all of the tokens available to create regular expressions.<p>Click a selected item again to insert it into your Expression.</p><p>Click the <span class='icon'>&#xE212;</span> beside an example to load it.</p>",
        target: "expr",
        kids: [{
            label: "Character classes",
            id: "charclasses",
            desc: "Character classes match a character from a specific set. There are a number of predefined character classes and you can also define your own sets.",
            kids: [{
                id: "dot",
                desc: "Matches any character except line breaks.",
                ext: " Equivalent to <code>[^\\n\\r]</code>.",
                example: [".", "glib jocks vex dwarves!"],
                token: "."
            }, {
                label: "match any",
                desc: "A character set that can be used to match any character, including line breaks.<p>An alternative is <code>[^]</code>, but it is not supported in all browsers.</p>",
                example: ["[\\s\\S]", "glib jocks vex dwarves!"],
                token: "[\\s\\S]"
            }, {
                id: "word",
                desc: "Matches any word character (alphanumeric & underscore).",
                ext: " Only matches low-ascii characters (no accented or non-roman characters). Equivalent to <code>[A-Za-z0-9_]</code>",
                example: ["\\w", "bonjour, mon fr\u00E8re"],
                token: "\\w"
            }, {
                id: "notword",
                label: "not word",
                desc: "Matches any character that is not a word character (alphanumeric & underscore).",
                ext: " Equivalent to <code>[^A-Za-z0-9_]</code>",
                example: ["\\W", "bonjour, mon fr\u00E8re"],
                token: "\\W"
            }, {
                id: "digit",
                desc: "Matches any digit character (0-9).",
                ext: " Equivalent to <code>[0-9]</code>.",
                example: ["\\d", "+1-(444)-555-1234"],
                token: "\\d"
            }, {
                id: "notdigit",
                label: "not digit",
                desc: "Matches any character that is not a digit character (0-9).",
                ext: " Equivalent to <code>[^0-9]</code>.",
                example: ["\\D", "+1-(444)-555-1234"],
                token: "\\D"
            }, {
                id: "whitespace",
                desc: "Matches any whitespace character (spaces, tabs, line breaks).",
                example: ["\\s", "glib jocks vex dwarves!"],
                token: "\\s"
            }, {
                id: "notwhitespace",
                label: "not whitespace",
                desc: "Matches any character that is not a whitespace character (spaces, tabs, line breaks).",
                example: ["\\S", "glib jocks vex dwarves!"],
                token: "\\S"
            }, {
                id: "set",
                label: "character set",
                desc: "Match any character in the set.",
                example: ["[aeiou]", "glib jocks vex dwarves!"],
                token: "[ABC]"
            }, {
                id: "setnot",
                label: "negated set",
                desc: "Match any character that is not in the set.",
                example: ["[^aeiou]", "glib jocks vex dwarves!"],
                token: "[^ABC]"
            }, {
                id: "range",
                tip: "Matches a character in the range {{getChar(prev)}} to {{getChar(next)}} (char code {{prev.code}} to {{next.code}}).",
                example: ["[g-s]", "abcdefghijklmnopqrstuvwxyz"],
                desc: "Matches a character having a character code between the two specified characters inclusive.",
                token: "[A-Z]"
            }]
        }, {
            label: "Anchors",
            id: "anchors",
            desc: "Anchors are unique in that they match a position within a string, not a character.",
            kids: [{
                id: "bof",
                label: "beginning",
                desc: "Matches the beginning of the string, or the beginning of a line if the multiline flag (<code>m</code>) is enabled.",
                ext: " This matches a position, not a character.",
                example: ["^\\w+", "she sells seashells"],
                token: "^"
            }, {
                id: "eof",
                label: "end",
                desc: "Matches the end of the string, or the end of a line if the multiline flag (<code>m</code>) is enabled.",
                ext: " This matches a position, not a character.",
                example: ["\\w+$", "she sells seashells"],
                token: "$"
            }, {
                id: "wordboundary",
                label: "word boundary",
                desc: "Matches a word boundary position such as whitespace, punctuation, or the start/end of the string.",
                ext: " This matches a position, not a character.",
                example: ["s\\b", "she sells seashells"],
                token: "\\b"
            }, {
                id: "notwordboundary",
                label: "not word boundary",
                desc: "Matches any position that is not a word boundary.",
                ext: " This matches a position, not a character.",
                example: ["s\\B", "she sells seashells"],
                token: "\\B"
            }]
        }, {
            label: "Escaped characters",
            id: "escchars",
            desc: "Some characters have special meaning in regular expressions and must be escaped. All escaped characters begin with the <code>\\</code> character.<br/><br/> Within a character set, only <code>\\</code>, <code>-</code>, and <code>]</code> need to be escaped.",
            kids: [{
                id: "escoctal",
                label: "octal escape",
                desc: "Octal escaped character in the form <code>\\000</code>.",
                ext: " Value must be less than 255 (<code>\\377</code>).",
                example: ["\\251", "RegExr is \u00A92014"],
                token: "\\000"
            }, {
                id: "eschexadecimal",
                label: "hexadecimal escape",
                desc: "Hexadecimal escaped character in the form <code>\\xFF</code>.",
                example: ["\\xA9", "RegExr is \u00A92014"],
                token: "\\xFF"
            }, {
                id: "escunicode",
                label: "unicode escape",
                desc: "Unicode escaped character in the form <code>\\uFFFF</code>.",
                example: ["\\u00A9", "RegExr is \u00A92014"],
                token: "\\uFFFF"
            }, {
                id: "esccontrolchar",
                label: "control character escape",
                desc: "Escaped control character in the form <code>\\cZ</code>.",
                ext: " This can range from <code>\\cA</code> (NULL, char code 0) to <code>\\cZ</code> (EM, char code 25). <h1>Example:</h1><code>\\cI</code> matches TAB (char code 9).",
                token: "\\cI"
            }]
        }, {
            label: "Groups & Lookaround",
            id: "groups",
            desc: "Groups allow you to combine a sequence of tokens to operate on them together. Capture groups can be referenced by a backreference and accessed separately in the results.<hr/>Lookaround lets you match a group without including it in the result.",
            kids: [{
                id: "group",
                label: "capturing group",
                desc: "Groups multiple tokens together and creates a capture group for extracting a substring or using a backreference.",
                example: ["(ha)+", "hahaha haa hah!"],
                token: "(ABC)"
            }, {
                id: "backref",
                label: "backreference",
                tip: "Matches the results of capture group #{{group.num}}.",
                desc: "Matches the results of a previous capture group. For example <code>\\1</code> matches the results of the first capture group & <code>\\3</code> matches the third.",
                example: ["(\\w)a\\1", "hah dad bad dab gag gab"],
                token: "\\1"
            }, {
                id: "noncapgroup",
                label: "non-capturing group",
                desc: "Groups multiple tokens together without creating a capture group.",
                example: ["(?:ha)+", "hahaha haa hah!"],
                token: "(?:ABC)"
            }, {
                id: "poslookahead",
                label: "positive lookahead",
                desc: "Matches a group after the main expression without including it in the result.",
                example: ["\\d(?=px)", "1pt 2px 3em 4px"],
                token: "(?=ABC)"
            }, {
                id: "neglookahead",
                label: "negative lookahead",
                desc: "Specifies a group that can not match after the main expression (if it matches, the result is discarded).",
                example: ["\\d(?!px)", "1pt 2px 3em 4px"],
                token: "(?!ABC)"
            }, {
                id: "poslookbehind",
                label: "positive lookbehind*",
                desc: "<b>*Not supported in JavaScript.</b> Matches a group before the main expression without including it in the result.",
                token: "(?<=ABC)"
            }, {
                id: "neglookbehind",
                label: "negative lookbehind*",
                desc: "<b>*Not supported in JavaScript.</b> Specifies a group that can not match before the main expression (if it matches, the result is discarded).",
                token: "(?&lt;!ABC)"
            }]
        }, {
            label: "Quantifiers & Alternation",
            id: "quants",
            desc: "Quantifiers indicate that the preceding token must be matched a certain number of times. By default, quantifiers are greedy, and will match as many characters as possible.<hr/>Alternation acts like a boolean OR, matching one sequence or another.",
            kids: [{
                id: "plus",
                desc: "Matches 1 or more of the preceding token.",
                example: ["b\\w+", "b be bee beer beers"],
                token: "+"
            }, {
                id: "star",
                desc: "Matches 0 or more of the preceding token.",
                example: ["b\\w*", "b be bee beer beers"],
                token: "*"
            }, {
                id: "quant",
                label: "quantifier",
                desc: "Matches the specified quantity of the previous token. <code>{1,3}</code> will match 1 to 3. <code>{3}</code> will match exactly 3. <code>{3,}</code> will match 3 or more. ",
                example: ["b\\w{2,3}", "b be bee beer beers"],
                token: "{1,3}"
            }, {
                id: "opt",
                label: "optional",
                desc: "Matches 0 or 1 of the preceding token, effectively making it optional.",
                example: ["colou?r", "color colour"],
                token: "?"
            }, {
                id: "lazy",
                desc: "Makes the preceding quantifier lazy, causing it to match as few characters as possible.",
                ext: " By default, quantifiers are greedy, and will match as many characters as possible.",
                example: ["b\\w+?", "b be bee beer beers"],
                token: "?"
            }, {
                id: "alt",
                label: "alternation",
                desc: "Acts like a boolean OR. Matches the expression before or after the <code>|</code>.",
                ext: "<p>It can operate within a group, or on a whole expression. The patterns will be tested in order.</p>",
                example: ["b(a|e|i)d", "bad bud bod bed bid"],
                token: "|"
            }]
        }, {
            label: "Substitution",
            desc: "These tokens are used in a substitution string to insert different parts of the match.",
            target: "subst",
            kids: [{
                id: "subst_match",
                label: "match",
                desc: "Inserts the matched text.",
                token: "$$&"
            }, {
                id: "subst_num",
                label: "capture group",
                tip: "Inserts the results of capture group #{{group.num}}.",
                desc: "Inserts the results of the specified capture group (ex. $3 will insert the third capture group).",
                token: "$1"
            }, {
                id: "subst_pre",
                label: "before match",
                desc: "Inserts the portion of the source string that precedes the match.",
                token: "$$`"
            }, {
                id: "subst_post",
                label: "after match",
                desc: "Inserts the portion of the source string that follows the match.",
                token: "$$'"
            }, {
                id: "subst_$",
                label: "escaped $",
                desc: "Inserts a dollar sign character ($).",
                token: "$$$$"
            }, {
                label: "escaped characters",
                token: "\\n",
                desc: "Escaped characters compatible with the JS string format, such as <code>\\n</code>, <code>\\t</code>, <code>\\x09</code>, & <code>\\u0009</code> are supported in the substitution string."
            }]
        }, {
            id: "flags",
            label: "Flags",
            tooltip: "Expression flags change how the expression is interpreted. Click to edit.",
            desc: "Expression flags change how the expression is interpreted. There are three flags in JS: i, g, and m. Flags follow the closing backslash of the expression (ex. <code>/.+/igm</code> ).",
            target: "flags",
            kids: [{
                id: "flag_i",
                label: "ignore case",
                desc: "Makes the whole expression case-insensitive.",
                ext: " For example, <code>/aBc/i</code> would match <code>AbC</code>.",
                token: "i"
            }, {
                id: "flag_g",
                label: "global search",
                tip: "Retain the index of the last match, allowing iterative searches.",
                desc: "Retain the index of the last match, allowing subsequent searches to start from the end of the previous match.<p>Without the global flag, subsequent searches will return the same match.</p><hr/>RegExr only searches for a single match when the global flag is disabled to avoid infinite match errors.",
                token: "g"
            }, {
                id: "flag_m",
                label: "multiline",
                tip: "Beginning/end anchors (<b>^</b>/<b>$</b>) will match the start/end of a line.",
                desc: "When the multiline flag is enabled, beginning and end anchors (<code>^</code> and <code>$</code>) will match the start and end of a line, instead of the start and end of the whole string.<p>Note that patterns such as <code>/^[\\s\\S]+$/m</code> may return matches that span multiple lines because the anchors will match the start/end of <b>any</b> line.</p>",
                token: "m"
            }]
        }]
    }
})();