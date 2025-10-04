/**
 * Substitui ocorrências de 'auto_repl' em uma frase por valores fornecidos
 * @param {string} phrase - Frase original
 * @param {string|string[]} replace - Valor ou array de valores para substituir
 * @returns {string}
 */
module.exports = (phrase, replace) => {

    if (Array.isArray(replace)) {

        // Substitui cada ocorrência sequencialmente sem alterar o array original
        let result = phrase
        let idx = 0

        while (result.includes('auto_repl') && idx < replace.length) {
            result = result.replace('auto_repl', replace[idx])
            idx++
        }

        return result

    } else // Substitui todas as ocorrências por um único valor
        return phrase.replaceAll('auto_repl', replace)
}