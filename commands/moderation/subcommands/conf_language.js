module.exports = async ({ client, user, interaction, guild }) => {

    let novo_idioma = interaction.options.getString("language")
    const frase_retorno = `:flag_${novo_idioma.slice(3, 5)}: | ${client.tls.phrase(user, "mode.idiomas.idioma_server")} \`${client.tls.phrase(user, `mode.idiomas.siglas.${novo_idioma}`)}\``

    // Realizando a alteração de idioma do servidor
    guild.lang = novo_idioma
    await guild.save()

    interaction.reply({
        content: frase_retorno,
        ephemeral: true
    })
}