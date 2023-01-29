const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank')
        .setNameLocalizations({
            "pt-BR": 'banco',
            "es-ES": 'banco',
            "fr": 'banque',
            "it": 'banca',
            "ru": 'банк'
        })
        .setDescription('⌠💸⌡ See your Bufunfas')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💸⌡ Veja suas Bufunfas',
            "es-ES": '⌠💸⌡ Mira a tus Bufunfas',
            "fr": '⌠💸⌡ Voir vos Bufunfas',
            "it": '⌠💸⌡ Visualizza il tuo Bufunfa',
            "ru": '⌠💸⌡ посмотреть свой Bufunfa'
        })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "fr": 'user',
                    "it": 'utente',
                    "ru": 'пользователь'
                })
                .setDescription('View another user\'s bank')
                .setDescriptionLocalizations({
                    "pt-BR": 'Visualizar o banco de outro usuário',
                    "es-ES": 'Ver el banco de otro usuario',
                    "fr": 'Afficher la banque d\'un autre utilisateur',
                    "it": 'Visualizza la banca di un altro utente',
                    "ru": 'Просмотр банка другого пользователя'
                })),
    async execute(client, user, interaction) {

        let alvo = interaction.options.getUser('user') || interaction.user
        const date1 = new Date()

        if (user.uid === "297153970613387264")
            user.misc.money = -4002892228342
        else if (user.uid === client.discord.user.id)
            user.misc.money = 1000000000000

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        let daily = `${client.tls.phrase(user, "misc.banco.dica_comando")} ${client.emoji(emojis_dancantes)}`
        let titulo_embed = client.tls.phrase(user, "misc.banco.suas_bufunfas")

        if (user.uid !== interaction.user.id) {
            daily = ""
            titulo_embed = `> ${client.tls.phrase(user, "misc.banco.bufunfas_outros").replace("nome_repl", alvo.username)}`
        }

        if (user.misc.daily && user.uid === interaction.user.id) {
            const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((59 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

            daily = `${client.tls.phrase(user, "misc.banco.daily")} <t:${tempo_restante}:R>\n[ <t:${tempo_restante}:f> ]`
        }

        let lang = "fix"

        if (user.misc.money < 0)
            lang = "diff"

        const embed = new EmbedBuilder()
            .setTitle(titulo_embed)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`:bank: ${client.tls.phrase(user, "misc.banco.bufunfas")}\`\`\`${lang}\nB$${client.formata_num(user.misc.money)}\`\`\`\n${daily}`)

        if (user.uid === interaction.user.id)
            embed.setFooter({ text: client.tls.phrase(user, "misc.banco.dica_rodape"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

        interaction.reply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
    }
}