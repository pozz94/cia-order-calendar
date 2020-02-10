@{%
const moo = require("moo");

const lexer = moo.compile({
    //ws: /[ \t]+/,
    ws: { match: /\s+/, lineBreaks: true },
    comma: ',',
    dot: '.',
    lb: '(',
    rb: ')',
    lcb: '{',
    rcb: '}',
    equal: '=',
    dqstr: /"(?:\\["\\]|[^\n"\\])*"/,
    sqstr: /`(?:\\[`\\]|[^\n`\\])*`/,
    btstr: /'(?:\\['\\]|[^\n'\\])*'/,
    number: /[0-9]+(?:.[0-9]+)?/,
    name: /[a-zA-Z_][a-zA-Z0-9_]*/,
    undef: 'undefined',
    nill: 'null'
});
%}
@lexer lexer

object -> _ %name _ gen _ {%data => {return {href:data[1].text, ...data[3]}}%}

gen -> options:? _ "{" elements "}" 
{%
    data => {
        const options = data[0]?{options: data[0]}:null;
        return {
            data: data[3],
            ...options
        };
    }
%}

options-> "(" opts ")"{%data => data[1]%}

opts
    -> opt "," opts {%data => {return {...data[0], ...data[2]}}%}
    |  opt {% id %}

opt -> _ %name _ "=" _ (string|number|"undefined"|"null") {%
    data => {
        return {
            [data[1].text]:(data[5][0]==="undefined")?0:data[5][0]
        };
    }
%}

string->(%dqstr|%sqstr|%btstr){%
    data => {
        let string = data[0][0].toString();
        const quote = string.charAt(0);
        string = string.slice(1,-1).replace("\\"+quote, quote).replace(/\\\\/g, "\\")
        return string
    }
%}

number->%number{%
    data => {
        return parseFloat(data[0].toString());
    }
%}

elements 
    -> element "," elements {%data => [data[0], ...data[2]]%}
    |  element

element 
    -> _ %name _ {%data=>data[1].text%}
    |  _ object _ {%data=>data[1]%}

_->%ws:?