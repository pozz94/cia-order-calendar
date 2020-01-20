@builtin "string.ne"
@builtin "whitespace.ne"

gen -> _ options:? "{" _ elements _ "}" _ {% data=>[...data[4], data[1]||[]] %}

options-> _ "[" _ opts _ "]" _ {%data=>data[3]%}

opts
    -> opt _ "," _ opts {%data=>[data[0], ...data[4]]%}
    |  opt

opt -> string _ ":" _ (dqstring|sqstring|btstring) {%data=>[data[0],data[4]]%}

elements 
    -> element _ "," _ elements {% data=>[data[0], ...data[4]] %}
    |  element

element 
    -> string {% id %}
    |  object {% id %}

string -> [a-zA-Z0-9]:+ {% data => data[0].join("") %}

object -> string _ ":" _ gen {% data => {return {[data[0]]:data[4]}} %}