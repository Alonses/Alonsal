const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("broadcast")
        .setDescription("⌠📡⌡ Start a broadcast")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Starten Sie eine Übertragung',
            "es-ES": '⌠📡⌡ Iniciar una transmisión',
            "fr": '⌠📡⌡ Lancer une diffusion',
            "it": '⌠📡⌡ Avviare una trasmissione',
            "pt-BR": '⌠📡⌡ Iniciar um broadcast',
            "ru": '⌠📡⌡ начать трансляцию'
        }),
    async execute({ client, user, interaction }) {

        const guild = await client.getGuild(interaction.guild.id)

        // Verificando se o Broadcast é permitido no servidor
        if (!client.decider(guild?.conf.broadcast, 0))
            return client.tls.reply(interaction, user, "mode.broadcast.desligado", true, client.emoji(0))

        // Sem permissão para enviar mensagens
        if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.SendMessages], interaction))
            return client.tls.reply(interaction, user, "mode.broadcast.canal_invalido", true, client.emoji(0))

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "mode.broadcast.solicitando")} ${client.emoji("emojis_dancantes")}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "mode.broadcast.descricao"))
            .setFooter({
                text: client.tls.phrase(user, "manu.painel.rodape"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        const row = client.create_buttons([
            { id: "guild_solicitar_broadcast", name: client.tls.phrase(user, "menu.botoes.solicitar"), type: 1, emoji: client.emoji("emojis_dancantes"), data: "1" },
            { id: "guild_solicitar_broadcast", name: "Broadcast", type: client.execute("functions", "emoji_button.type_button", guild?.conf.broadcast), emoji: client.execute("functions", "emoji_button.emoji_button", guild?.conf.broadcast), data: "2" }
        ], interaction)

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}