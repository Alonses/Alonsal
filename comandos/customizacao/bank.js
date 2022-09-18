const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const busca_emoji = require('../../adm/funcoes/busca_emoji')
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

        let alvo = interaction.options.getUser('usuario') || interaction.options.getUser('user')

        if (!alvo)
            alvo = interaction.user

        const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.custom.getUser(alvo.id)

        let daily = `${customizacao[3]["dica_comando"]} ${busca_emoji(client, emojis_dancantes)}`

        if (user.id != interaction.user.id)
            daily = ""

        if (user.daily)
            daily = `${customizacao[3]["daily"]} <t:${user.daily + 86400}:R>\n[ <t:${user.daily + 86400}:f> ]`

        const embed = new EmbedBuilder()
            .setTitle(customizacao[3]["suas_bufunfas"])
            .setColor(user.color)
            .setDescription(`:bank: ${customizacao[3]["bufunfas"]}\`\`\`fix\nB$${user.money.toLocaleString('pt-BR')}\`\`\`\n${daily}`)

        if (user.id == interaction.user.id)
            embed.setFooter({ text: customizacao[3]["dica_rodape"], iconURL: interaction.user.avatarURL({ dynamic: true }) })

        interaction.reply({ embeds: [embed] })
    }
}