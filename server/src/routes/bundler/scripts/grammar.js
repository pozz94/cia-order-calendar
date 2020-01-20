// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "gen$ebnf$1", "symbols": ["options"], "postprocess": id},
    {"name": "gen$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "gen", "symbols": ["_", "gen$ebnf$1", {"literal":"{"}, "_", "elements", "_", {"literal":"}"}, "_"], "postprocess": data=>[...data[4], data[1]||[]]},
    {"name": "options", "symbols": ["_", {"literal":"["}, "_", "opts", "_", {"literal":"]"}, "_"], "postprocess": data=>data[3]},
    {"name": "opts", "symbols": ["opt", "_", {"literal":","}, "_", "opts"], "postprocess": data=>[data[0], ...data[4]]},
    {"name": "opts", "symbols": ["opt"]},
    {"name": "opt$subexpression$1", "symbols": ["dqstring"]},
    {"name": "opt$subexpression$1", "symbols": ["sqstring"]},
    {"name": "opt$subexpression$1", "symbols": ["btstring"]},
    {"name": "opt", "symbols": ["string", "_", {"literal":":"}, "_", "opt$subexpression$1"], "postprocess": data=>{return {key:data[0], value:data[4][0]}}},
    {"name": "elements", "symbols": ["element", "_", {"literal":","}, "_", "elements"], "postprocess": data=>[data[0], ...data[4]]},
    {"name": "elements", "symbols": ["element"]},
    {"name": "element", "symbols": ["string"], "postprocess": id},
    {"name": "element", "symbols": ["object"], "postprocess": id},
    {"name": "string$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": ["string$ebnf$1"], "postprocess": data => data[0].join("")},
    {"name": "object", "symbols": ["string", "_", {"literal":":"}, "_", "gen"], "postprocess": data => {return {[data[0]]:data[4]}}}
]
  , ParserStart: "gen"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
