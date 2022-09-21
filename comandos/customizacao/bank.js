const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const busca_emoji = require('../../adm/discord/busca_emoji')
const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank')
        .setNameLocalizations({
            "pt-BR": 'banco',
            "es-ES": 'banco',
            "fr": 'banque'
        })
        .setDescription('⌠💸⌡ See your Bufunfas')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Veja suas Bufunfas',
            "es-ES": '⌠💸⌡ Mira a tus Bufunfas',
            "fr": '⌠💸⌡ Voir vos Bufunfas'
        })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "fr": 'user'
                })
                .setDescription('View another user\'s bank')
                .setDescriptionLocalizations({
                    "pt-BR": 'Visualizar o vanco de outro usuário',
                    "es-ES": 'Ver el banco de otro usuario',
                    "fr": 'Afficher la banque d\'un autre utilisateur'
                })),
    async execute(client, interaction) {

        let alvo = interaction.options.getUser('user') || interaction.user

        const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(alvo.id), date1 = new Date()

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        let daily = `${customizacao[3]["dica_comando"]} ${busca_emoji(client, emojis_dancantes)}`
        let titulo_embed = customizacao[3]["suas_bufunfas"]

        if (user.id !== interaction.user.id) {
            daily = ""
            titulo_embed = `> ${customizacao[3]["bufunfas_outros"].replace("nome_repl", alvo.username)}`
        }

        if (user.daily && user.id == interaction.user.id) {
            const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((59 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

            daily = `${customizacao[3]["daily"]} <t:${tempo_restante}:R>\n[ <t:${tempo_restante}:f> ]`
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo_embed)
            .setColor(user.color)
            .setDescription(`:bank: ${customizacao[3]["bufunfas"]}\`\`\`fix\nB$${formata_num(user.money)}\`\`\`\n${daily}`)

        if (user.id == interaction.user.id)
            embed.setFooter({ text: customizacao[3]["dica_rodape"], iconURL: interaction.user.avatarURL({ dynamic: true }) })

        interaction.reply({ embeds: [embed] })
    }
}