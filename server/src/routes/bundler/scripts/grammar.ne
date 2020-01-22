@builtin "string.ne"
@builtin "whitespace.ne"

gen -> _ options:? "{" _ elements _ "}" _ 
{%
    data => {
        const options = (data[1] && data[1].filter(i => i !== null))?{options: data[1]}:null
        return {
            data: data[4],
            ...options
        };
    }
%}

options-> _ "[" _ opts _ "]" _ {%data => data[3].filter(i => i !== null)%}

opts
    -> opt _ "," _ opts {%data => [data[0], ...data[4]]%}
    |  opt

opt -> string _ ":" _ (dqstring|sqstring|btstring) {%data => {return {key:data[0], value:data[4][0]};}%}

elements 
    -> element _ "," _ elements {%data => [data[0], ...data[4]]%}
    |  element

element 
    -> string {%id%}
    |  object {%id%}

string -> [a-zA-Z0-9]:+ {%data => data[0].join("")%}

object -> string _ gen {%data => {return {[data[0]]:data[2]}}%}