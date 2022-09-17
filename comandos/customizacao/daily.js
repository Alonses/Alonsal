const { SlashCommandBuilder } = require('discord.js')

const busca_emoji = require('../../adm/funcoes/busca_emoji')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('⌠💸⌡ Receive your daily credit')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Pegue sua bufunfa diária',
            "es-ES": '⌠💸⌡ Recibe tu crédito diario',
            "fr": '⌠💸⌡ Recevez votre crédit quotidien'
        }),
    async execute(client, interaction) {

        const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.custom.getUser(interaction.user.id)
        let tempo_restante = Math.floor(Date.now() / 1000 - user.daily)

        if (tempo_restante < 86400)
            return interaction.reply({ content: `:bank: | ${customizacao[0]["error"]} <t:${user.daily + 86400}:R>\n[ <t:${user.daily + 86400}:f> ]`, ephemeral: true })

        const emoji_dancando = busca_emoji(client, emojis_dancantes)

        const bufunfa = Math.floor(900 + (Math.random() * 500))
        user.money = parseInt(user.money) + bufunfa
        user.daily = Math.floor(Date.now() / 1000)

        // Salvando os dados do usuário
        client.custom.saveUser(user)

        interaction.reply({ content: `:money_with_wings: | ${customizacao[0]["daily"].replace("valor_repl", bufunfa.toLocaleString("pt-BR"))} ${emoji_dancando}`, ephemeral: true })
    }
}