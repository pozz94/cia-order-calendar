string -> relationship {% id %}
        | [@a-zA-Z0-9]:+ {% data => null %}

relationship -> "href_" url "$" [a-zA-Z0-9]:+ {% data => {return {key: data[3].join(""), href: data[1]}} %}

url -> [a-zA-Z0-9]:+ "_" url {% data => "/"+data[0].join("")+data[2] %}
    |  [a-zA-Z0-9]:+ {% data => "/"+data[0].join("") %}