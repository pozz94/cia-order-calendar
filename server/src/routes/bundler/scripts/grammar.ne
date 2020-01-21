@builtin "string.ne"
@builtin "whitespace.ne"
@{%
    let obj;
    const getJson = require("fetchUtils").getJson;
    let elements=0;
    let string=0;
    let object=0;
    let gen=0;
    let trueElements=0
%}

gen -> _ options:? "{" _ elements _ "}" _ 
    {% data=>{ return [...data[4], data[1]||null]; }%}

options-> _ "[" _ opts _ "]" _ {%
    data=>data[3].filter(i=>i!==null)
%}

opts
    -> opt _ "," _ opts {%data=>[data[0], ...data[4]]%}
    |  opt

opt -> string _ ":" _ (dqstring|sqstring|btstring) {%data=>{return {key:data[0], value:data[4][0]};}%}

elements 
    -> element _ "," _ elements {% data=>[data[0], ...data[4]] %}
    |  element

element 
    -> string {% id %}
    |  object {% id %}

string -> [a-zA-Z0-9]:+ {% data => data[0].join("") %}

object -> string _ ":" _ gen {% data => { return {[data[0]]:data[4].filter(i=>i!==null)}} %}