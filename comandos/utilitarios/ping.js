const { SlashCommandBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("⌠💡⌡ See your ping")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Veja seu ping',
            "es-ES": '⌠💡⌡ Ver tu ping',
            "fr": '⌠💡⌡ Voir votre ping',
            "it": '⌠💡⌡ Guarda il tuo ping',
            "ru": '⌠💡⌡ Проверьте свой пинг'
        }),
    async execute(client, user, interaction) {

        const m = await interaction.reply({ content: "Ping?", fetchReply: true, ephemeral: client.decider(user?.conf.ghost_mode, 0) })
        const delay = m.createdTimestamp - interaction.createdTimestamp

        let mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_1")} ${client.emoji(emojis.dancando_thanos)}`

        if (delay < 200)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_2")}`

        if (delay < 100)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_3")} ${client.emoji(emojis.dancando_steve)}`

        if (delay > 600)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_4")} ${client.emoji(emojis.pare_agr)}`

        if (delay <= 0)
            mensagem = `:ping_pong: Pong!? [ **\`${delay}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_5")} ${client.emoji(emojis.susto2)}`

        mensagem += `\n${client.tls.phrase(user, "util.ping.latencia")} [ **\`${Math.round(client.discord.ws.ping)}ms\`** ]`

        await interaction.editReply({ content: mensagem, ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }
}