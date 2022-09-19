const { SlashCommandBuilder } = require('discord.js')

const busca_emoji = require('../../adm/discord/busca_emoji')
const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('⌠💸⌡ Receive your daily bufunfa')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Pegue sua bufunfa diária',
            "es-ES": '⌠💸⌡ Recibe tu bufunfa diario',
            "fr": '⌠💸⌡ Recevez votre bufunfa quotidien'
        }),
    async execute(client, interaction) {

        const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id), date1 = new Date()
        let data_atual = date1.toDateString('pt-BR')
        const tempo_restante = Math.floor((date1.getTime() + (((24 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

        if (data_atual == user.daily)
            return interaction.reply({ content: `:bank: | ${customizacao[0]["error"]} <t:${tempo_restante}:R>\n[ <t:${tempo_restante}:f> ]`, ephemeral: true })

        const emoji_dancando = busca_emoji(client, emojis_dancantes)

        const bufunfa = Math.floor(900 + (Math.random() * 500))
        user.money += bufunfa
        user.daily = date1.toDateString('pt-BR')

        // Salvando os dados do usuário
        client.usuarios.saveUser(user)

        interaction.reply({ content: `:money_with_wings: | ${customizacao[0]["daily"].replace("valor_repl", bufunfa.toLocaleString("pt-BR"))} ${emoji_dancando}`, ephemeral: true })
    }
}