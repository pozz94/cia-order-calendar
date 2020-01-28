@builtin "string.ne"

object -> string gen {%data => {return {href:data[0], ...data[1]}}%}

gen -> options:? "{" elements "}" 
{%
    data => {
        const options = data[0]?{options: data[0]}:null;
        return {
            data: data[2],
            ...options
        };
    }
%}

options-> "(" opts ")"{%data => data[1]%}

opts
    -> opt "," opts {%data => {return {...data[0], ...data[2][0]}}%}
    |  opt

opt -> string "=" (dqstring|sqstring|btstring|number) {%data => {return {[data[0]]:data[2][0]};}%}

number 
    -> [0-9]:+ "." [0-9]:* {%data => parseFloat(data[0].join("") + "." + data[2].join(""))%}
    |  [0-9]:+ {%data => parseInt(data[0].join(""))%}

elements 
    -> element "," elements {%data => [data[0], ...data[2]]%}
    |  element

element 
    -> string {%id%}
    |  object {%id%}

string -> [a-zA-Z0-9]:+ {%data => data[0].join("")%}