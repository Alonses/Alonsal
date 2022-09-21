const { SlashCommandBuilder } = require('discord.js')
const busca_emoji = require('../../adm/discord/busca_emoji')
const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('⌠💡⌡ See your ping')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Veja seu ping',
            "es-ES": '⌠💡⌡ Ver tu ping',
            "fr": '⌠💡⌡ Voir votre ping'
        }),
    async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        const m = await interaction.reply({ content: "Ping?", fetchReply: true })
        const delay = m.createdTimestamp - interaction.createdTimestamp

        let mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_1"]} ${busca_emoji(client, emojis.dancando_thanos)}`

        if (delay < 200)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_2"]}`

        if (delay < 100)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_3"]} ${busca_emoji(client, emojis.dancando_steve)}`

        if (delay > 600)
            mensagem = `:ping_pong: Pong! [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_4"]} ${busca_emoji(client, emojis.pare_agr)}`

        if (delay <= 0)
            mensagem = `:ping_pong: Pong!? [ **\`${delay}ms\`** ] ${utilitarios[0]["ping_5"]} ${busca_emoji(client, emojis.susto2)}`

        mensagem += `\n${utilitarios[0]["latencia"]} [ **\`${Math.round(client.ws.ping)}ms\`** ]`

        await interaction.editReply({ content: mensagem })
    }
}