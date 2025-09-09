const { languagesMap } = require("../../../core/formatters/patterns/user")

module.exports = async ({ client, user, interaction, guild }) => {

    let novo_idioma = interaction.options.getString("language")
    let frase_retorno

    if (novo_idioma === "pt-hp" || novo_idioma === "pt-al") { // Hopês ou Alonsês

        if (!guild.misc.second_lang) { // Definindo um idioma secundário
            guild.misc.second_lang = novo_idioma
            frase_retorno = languagesMap[novo_idioma.slice(3, 5)][1]
        } else { // Removendo o idioma secundário
            guild.misc.second_lang = null
            frase_retorno = client.tls.phrase(user, "mode.idiomas.idioma_secundario_removido", 11)
        }
    } else { // Realizando a alteração de idioma do servidor
        guild.lang = novo_idioma
        frase_retorno = `:flag_${novo_idioma.slice(3, 5)}: | ${client.tls.phrase(user, "mode.idiomas.idioma_server")} \`${client.tls.phrase(user, `mode.idiomas.siglas.${novo_idioma}`)}\``
    }

    await guild.save()

    interaction.reply({
        content: frase_retorno,
        flags: "Ephemeral"
    })
}