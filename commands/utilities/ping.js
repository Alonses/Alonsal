const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("⌠💡⌡ See your ping")
        .setDescriptionLocalizations({
            "de": '⌠💡⌡ Überprüfen Sie Ihren Ping',
            "es-ES": '⌠💡⌡ Ver tu ping',
            "fr": '⌠💡⌡ Voir votre ping',
            "it": '⌠💡⌡ Guarda il tuo ping',
            "pt-BR": '⌠💡⌡ Veja seu ping',
            "ru": '⌠💡⌡ Проверьте свой пинг'
        }),
    async execute({ client, user, interaction }) {

        await interaction.reply('Ping?')

        const reply = await interaction.fetchReply()
        const clientPing = reply.createdTimestamp - interaction.createdTimestamp
        const websocketPing = client.discord.ws.ping

        let mensagem = `:ping_pong: Pong! [ **\`Client: ${clientPing}ms\`** | **\`Websocket: ${websocketPing}ms\`**] ${client.tls.phrase(user, "util.ping.ping_1")} ${client.emoji("dancando_thanos")}`

        if (clientPing < 200)
            mensagem = `:ping_pong: Pong! [ **\`Client: ${clientPing}ms\`** | **\`Websocket: ${websocketPing}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_2")}`

        if (clientPing < 100)
            mensagem = `:ping_pong: Pong! [ **\`Client: ${clientPing}ms\`** | **\`Websocket: ${websocketPing}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_3")} ${client.emoji("dancando_steve")}`

        if (clientPing > 600)
            mensagem = `:ping_pong: Pong! [ **\`Client: ${clientPing}ms\`** | **\`Websocket: ${websocketPing}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_4")} ${client.emoji("pare_agr")}`

        if (clientPing <= 0)
            mensagem = `:ping_pong: Pong!? [ **\`Client: ${clientPing}ms\`** | **\`Websocket: ${websocketPing}ms\`** ] ${client.tls.phrase(user, "util.ping.ping_5")} ${client.emoji("susto2")}`

        interaction.editReply({ content: mensagem, flags: "Ephemeral" })
    }
}