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

module.exports = (string) => {

    if (!string) return "`Sem texto`"

    // Removendo espaços desnecessários
    string = string.trim().replace(/\s+/g, ' ')

    Object.keys(cases).forEach(chave => {

        if (string.includes(chave)) // Substituindo a ocorrência pelo texto esperado
            string = string.replaceAll(chave, cases[chave])
    })

    if (string.length > 2000)
        string = `${string.slice(0, 1995)}...`

    return string
}