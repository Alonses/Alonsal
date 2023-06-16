const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    let guild = await client.getGuild(interaction.guild.id)

    const dados = {
        role: interaction.options.getRole("role"),
        channel: interaction.options.getChannel("channel"),
        lang: interaction.options.getString("language")
    }

    if (dados.role) {
        dados.role = dados.role.id
        guild.games.role = dados.role
    }

    if (dados.channel) {

        // Tipo 0 -> Canal de texto tipo normal
        // Tipo 5 -> Canal de texto tipo anúncios
        if (dados.channel.type !== 0 && dados.channel.type !== 5) // Verificando se o canal mencionado é inválido
            return client.tls.reply(interaction, user, "mode.anuncio.tipo_canal", true, 0)

        dados.channel = dados.channel.id
        guild.games.channel = dados.channel
    }

    if (!guild.lang) {
        guild.lang = client.idioma.getLang(interaction)
        dados.lang = guild.lang
    }

    if (!dados.lang)
        dados.lang = guild.lang

    const row = client.create_buttons([{ id: "notify_button", name: "Ativar", type: 0, emoji: client.emoji(20), data: `1|${interaction.guild.id}` }, { id: "notify_button", name: "Ativar e anunciar", type: 2, emoji: client.defaultEmoji("channel"), data: `2|${interaction.guild.id}` }, { id: "notify_button", name: "Cancelar", type: 3, emoji: client.emoji(13), data: `0|${interaction.guild.id}` }], interaction)

    const embed = new EmbedBuilder()
        .setTitle("> Configurações de anúncios 🎮")
        .setColor(client.embed_color(user.misc.color))
        .setDescription("Ative ou cancele o módulo de anúncios de games.\n\nO Módulo de games enviará anúncios de jogos que estiverem de graça automaticamente no seu servidor, você pode ativar este módulo agora de duas formas, simplesmente ativando, ou o melhor deles, ativando e já disparando uma notificação com todos os games que estão gratuitos agora!\n\nSelecione uma das opções abaixo ou cancele para descartar as alterações.")
        .setFields(
            {
                name: ":label: **Cargo**",
                value: `( <@&${dados.role}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **Canal**`,
                value: `( <#${dados.channel}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("translate")} **Idioma :flag_${dados.lang.slice(3, 5)}:**`,
                value: "⠀",
                inline: true
            }
        )

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
}