@builtin "string.ne"

gen -> _ options:? "{" _ elements _ "}" _ {% data=>data[4] %}

options-> _ "[" _ opts _ "]" _

opts
    -> opt _ "," _ opts
    |  opt

opt -> string _ ":" _ (dqstring|sqstring|btstring)

elements 
    -> element _ "," _ elements
    {% data=>[data[0], ...data[4]] %}
    |  element

element 
    -> string {% id %}
    |  object {% id %}

string -> [a-zA-Z0-9]:+ {% data => data[0].join("") %}

object -> string _ ":" _ gen {% data => {return {[data[0]]:data[4]}} %}

_ -> [ \t\n\v\f]:*