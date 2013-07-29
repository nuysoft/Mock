var Handlebars = require('handlebars'),
    _ = require('underscore')

    function hereDoc(f) {
        return f.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '')
            .trim();
    }

var TC = hereDoc(function() {
    /*
{{#exist}}
<div class="entry">
    <h1>{{title}}</h1>
    <div class="body">
        {{body}}
    </div>
    
    {{#bar}}
        {{foobar}}
    {{/bar}}

    {{#each articles.[10].[#comments]}}
    <h1>{{subject}}</h1>
    <div>
        {{body}}
    </div>
    {{/each}}

</div>
{{/exist}}
*/
});

var ast = Handlebars.parse(TC);
// console.log(ast);
console.log(JSON.stringify(ast, null, 4));

for (var n in Handlebars.AST) {
    console.log(n);
}

/*
    TODO
*/
var Mock4Tpl = {
    AST: {
        ProgramNode: function() {
            // program 
            // statements
            _.each(this.statements, function(element, index) {
                console.log(element, index);
            })
        },
        MustacheNode: function() {
            // mustache 
            // string params
        },
        PartialNode: function() {
            // partial
            // partialName context 
        },
        BlockNode: function() {
            // block
            // mustache program inverse
        },
        ContentNode: function() {
            // content 
            // string
        },
        HashNode: function() {
            // hash
            // pairs
        },
        IdNode: function() {
            // ID
            // original
        },
        PartialNameNode: function() {
            // PARTIAL_NAME
            // name
        },
        DataNode: function() {
            // DATA
            // id
        },
        StringNode: function() {
            // STRING
            // string
        },
        IntegerNode: function() {
            // INTEGER
            // integer
        },
        BooleanNode: function() {
            // BOOLEAN
            // bool
        },
        CommentNode: function() {
            // comment
            // comment
        }
    }
}
/*
    type
    mustache
    program

*/
console.log(Mock4Tpl);