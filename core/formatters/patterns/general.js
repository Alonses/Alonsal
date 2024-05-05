const cases = {
    "&quot;": "\"",
    "&#039;": "'",
    "&amp;": "&",
    "&#34;": "\"",
    "&#39;": "'",
    "<br />": " ",
    "<strong>": "",
    "</strong>": "",
    "<em>": "",
    "</em>": "",
    "<span class=\"truncated-text\" >": "",
    "</span><span class=\"disclose-hide\" id=\"about-me-expanded\" >": "",
    "&#10;": "",
    "&#8204;": "",
    "<p class=\"truncate-text\"> ": ""
}

const months = {
    Fev: 'feb',
    Abr: 'apr',
    Maio: 'may',
    Ago: 'aug',
    Set: 'sep',
    Oct: 'oct',
    Dez: 'dec',
}

module.exports = {
    cases,
    months
}