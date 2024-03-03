module.exports = (phrase, replace) => {

    if (typeof replace === "object") { // Array com vários dados para alterar
        while (replace.length > 0) {
            phrase = phrase.replace("auto_repl", replace[0])
            replace.shift()
        }
    } else // Apenas um valor para substituição
        phrase = phrase.replaceAll("auto_repl", replace)

    return phrase
}