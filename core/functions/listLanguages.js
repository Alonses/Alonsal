const { languagesMap } = require("../formatters/patterns/user")

module.exports = ({ data }) => {

    const language = data.lang
    const idiomas = []

    Object.keys(languagesMap).forEach(lang => {
        if (lang !== language.slice(0, 2)) idiomas.push(lang)
    })

    return idiomas
}