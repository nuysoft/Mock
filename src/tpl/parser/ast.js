var AST = {};

AST.ProgramNode = function(statements, inverse) {
  this.type = "program";
  this.statements = statements;
  if (inverse) {
    this.inverse = new AST.ProgramNode(inverse);
  }
};

AST.MustacheNode = function(rawParams, hash, unescaped) {
  this.type = "mustache";
  this.escaped = !unescaped;
  this.hash = hash;

  var id = this.id = rawParams[0];
  var params = this.params = rawParams.slice(1);

  // a mustache is an eligible helper if:
  // * its id is simple (a single part, not `this` or `..`)
  var eligibleHelper = this.eligibleHelper = id.isSimple;

  // a mustache is definitely a helper if:
  // * it is an eligible helper, and
  // * it has at least one parameter or hash segment
  this.isHelper = eligibleHelper && (params.length || hash);

  // if a mustache is an eligible helper but not a definite
  // helper, it is ambiguous, and will be resolved in a later
  // pass or at runtime.
};

AST.PartialNode = function(partialName, context) {
  this.type = "partial";
  this.partialName = partialName;
  this.context = context;
};

AST.BlockNode = function(mustache, program, inverse, close) {
  if (mustache.id.original !== close.original) {
    throw new Exception(mustache.id.original + " doesn't match " + close.original);
  }

  this.type = "block";
  this.mustache = mustache;
  this.program = program;
  this.inverse = inverse;

  if (this.inverse && !this.program) {
    this.isInverse = true;
  }
};

AST.ContentNode = function(string) {
  this.type = "content";
  this.string = string;
};

AST.HashNode = function(pairs) {
  this.type = "hash";
  this.pairs = pairs;
};

AST.IdNode = function(parts) {
  this.type = "ID";

  var original = "",
    dig = [],
    depth = 0;

  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i].part;
    original += (parts[i].separator || '') + part;

    if (part === ".." || part === "." || part === "this") {
      if (dig.length > 0) {
        throw new Exception("Invalid path: " + original);
      } else if (part === "..") {
        depth++;
      } else {
        this.isScoped = true;
      }
    } else {
      dig.push(part);
    }
  }

  this.original = original;
  this.parts = dig;
  this.string = dig.join('.');
  this.depth = depth;

  // an ID is simple if it only has one part, and that part is not
  // `..` or `this`.
  this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

  this.stringModeValue = this.string;
};

AST.PartialNameNode = function(name) {
  this.type = "PARTIAL_NAME";
  this.name = name.original;
};

AST.DataNode = function(id) {
  this.type = "DATA";
  this.id = id;
};

AST.StringNode = function(string) {
  this.type = "STRING";
  this.original =
    this.string =
    this.stringModeValue = string;
};

AST.IntegerNode = function(integer) {
  this.type = "INTEGER";
  this.original =
    this.integer = integer;
  this.stringModeValue = Number(integer);
};

AST.BooleanNode = function(bool) {
  this.type = "BOOLEAN";
  this.bool = bool;
  this.stringModeValue = bool === "true";
};

AST.CommentNode = function(comment) {
  this.type = "comment";
  this.comment = comment;
};