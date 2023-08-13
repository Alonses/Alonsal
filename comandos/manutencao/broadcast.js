const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const { emoji_button, type_button } = require('../../adm/funcoes/emoji_button')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("broadcast")
        .setDescription("⌠📡⌡ Start a broadcast")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Iniciar um broadcast',
            "es-ES": '⌠📡⌡ Iniciar una transmisión',
            "fr": '⌠📡⌡ Lancer une diffusion',
            "it": '⌠📡⌡ Avviare una trasmissione',
            "ru": '⌠📡⌡ начать трансляцию'
        }),
    async execute(client, user, interaction) {

        const guild = await client.getGuild(interaction.guild.id)

        // Verificando se o Broadcast é permitido no servidor
        if (!client.decider(guild?.conf.broadcast, 0))
            return client.tls.reply(interaction, user, "mode.broadcast.desativado", true, 0)

        const canal_alvo = await client.channels().get(interaction.channel.id)

        // Sem permissão para enviar mensagens
        if (!canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.SendMessages))
            return client.tls.reply(interaction, user, "mode.broadcast.canal_invalido", true, 0)

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "mode.broadcast.solicitando")} ${client.emoji(emojis_dancantes)}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "mode.broadcast.descricao"))
            .setFooter({
                text: client.tls.phrase(user, "manu.painel.rodape"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        const row = client.create_buttons([
            { id: "guild_solicitar_broadcast", name: client.tls.phrase(user, "menu.botoes.solicitar"), type: 1, emoji: client.emoji(emojis_dancantes), data: "1" },
            { id: "guild_solicitar_broadcast", name: "Broadcast", type: type_button(guild?.conf.broadcast), emoji: emoji_button(guild?.conf.broadcast), data: "2" }
        ], interaction)

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    }
}