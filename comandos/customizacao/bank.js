const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const busca_emoji = require('../../adm/discord/busca_emoji')
const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank')
        .setNameLocalizations({
            "pt-BR": 'banco',
            "es-ES": 'banco',
            "fr": 'banque',
            "it": 'banca'
        })
        .setDescription('⌠💸⌡ See your Bufunfas')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Veja suas Bufunfas',
            "es-ES": '⌠💸⌡ Mira a tus Bufunfas',
            "fr": '⌠💸⌡ Voir vos Bufunfas',
            "it": '⌠💸⌡ Visualizza il tuo Bufunfa'
        })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "fr": 'user',
                    "it": 'utente'
                })
                .setDescription('View another user\'s bank')
                .setDescriptionLocalizations({
                    "pt-BR": 'Visualizar o banco de outro usuário',
                    "es-ES": 'Ver el banco de otro usuario',
                    "fr": 'Afficher la banque d\'un autre utilisateur',
                    "it": 'Visualizza la banca di un altro utente'
                })),
    async execute(client, interaction) {

        let alvo = interaction.options.getUser('user') || interaction.user
        const user = client.usuarios.getUser(alvo.id), date1 = new Date()

        if (user.id == "297153970613387264")
            user.misc.money = -4002892228342

        if (user.id == client.discord.user.id)
            user.misc.money = 1000000000000

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        let daily = `${client.tls.phrase(client, interaction, "misc.banco.dica_comando")} ${busca_emoji(client, emojis_dancantes)}`
        let titulo_embed = client.tls.phrase(client, interaction, "misc.banco.suas_bufunfas")

        if (user.id !== interaction.user.id) {
            daily = ""
            titulo_embed = `> ${client.tls.phrase(client, interaction, "misc.banco.bufunfas_outros").replace("nome_repl", alvo.username)}`
        }

        if (user.misc.daily && user.id == interaction.user.id) {
            const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((59 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

            daily = `${client.tls.phrase(client, interaction, "misc.banco.daily")} <t:${tempo_restante}:R>\n[ <t:${tempo_restante}:f> ]`
        }

        let lang = "fix"

        if (user.misc.money < 0)
            lang = "diff"

        const embed = new EmbedBuilder()
            .setTitle(titulo_embed)
            .setColor(user.misc.embed)
            .setDescription(`:bank: ${client.tls.phrase(client, interaction, "misc.banco.bufunfas")}\`\`\`${lang}\nB$${formata_num(user.misc.money)}\`\`\`\n${daily}`)

        if (user.id == interaction.user.id)
            embed.setFooter({ text: client.tls.phrase(client, interaction, "misc.banco.dica_rodape"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

        interaction.reply({ embeds: [embed] })
    }
}