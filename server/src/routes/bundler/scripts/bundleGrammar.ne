@builtin "string.ne"

object -> string gen {%data => {return {href:data[0], ...data[1]}}%}

gen -> options:? "{" elements "}" 
{%
    data => {
        const options = (data[0] && data[0].filter(i => i !== null))?{options: data[0]}:null
        return {
            data: data[2],
            ...options
        };
    }
%}

options-> "[" opts "]"{%data => data[1].filter(i => i !== null)%}

opts
    -> opt "," opts {%data => [data[0], ...data[2]]%}
    |  opt

opt -> string ":" (dqstring|sqstring|btstring) {%data => {return {key:data[0], value:data[2][0]};}%}

elements 
    -> element "," elements {%data => [data[0], ...data[2]]%}
    |  element

element 
    -> string {%id%}
    |  object {%id%}

string -> [a-zA-Z0-9]:+ {%data => data[0].join("")%}