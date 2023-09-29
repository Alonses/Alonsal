const { EmbedBuilder } = require('discord.js')

const { getUserStatements } = require('../../../core/database/schemas/Statement')

module.exports = async ({ client, user, interaction }) => {

    const date1 = new Date()
    let alvo = interaction.options.getUser("user") || interaction.user
    let user_interno = await client.getUser(alvo.id)

    if (user_interno.uid === client.id())
        user_interno.misc.money = 1000000000000

    let daily = `${client.tls.phrase(user, "misc.banco.dica_comando")} ${client.emoji("emojis_dancantes")}`
    let titulo_embed = client.tls.phrase(user, "misc.banco.suas_bufunfas")

    if (user_interno.uid !== interaction.user.id) {
        daily = ""
        titulo_embed = client.replace(client.tls.phrase(user, "misc.banco.bufunfas_outros"), alvo.username)
    }

    let data_atual = date1.toDateString('pt-BR')
    if (data_atual == user.misc.daily && user_interno.uid === interaction.user.id) {
        const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((59 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

        daily = `${client.tls.phrase(user, "misc.banco.daily")} <t:${tempo_restante}:R>\n[ <t:${tempo_restante}:f> ]`
    }

    let lang = "fix", extrato = ""

    if (user_interno.misc.money < 0)
        lang = "diff"

    if (interaction.user.id === user_interno.uid) {

        const movimentacoes = await getUserStatements(user_interno.uid)

        movimentacoes.forEach(movimentacao => {
            // Traduzindo a movimentação conforme o idioma do usuário
            let traducao = movimentacao.operation

            if (traducao) {
                if (movimentacao.operation.split(".").length > 2) // Modelo com string traduzível
                    traducao = client.tls.phrase(user, movimentacao.operation.split("|")[0])

                if (movimentacao.operation.includes("|"))
                    traducao = client.replace(traducao, movimentacao.operation.split("|")[1])

                extrato += `${movimentacao.type == false ? "🔴 -" : "🟢 +"}B$ ${client.locale(movimentacao.value)}, ${traducao}\n`
            }
        })

        if (extrato !== "")
            extrato = `\n\n${client.defaultEmoji("metrics")} **${client.tls.phrase(user, "misc.b_historico.movimentacoes")}**\`\`\`${extrato}\`\`\``
    }

    const embed = new EmbedBuilder()
        .setTitle(titulo_embed)
        .setColor(client.embed_color(user_interno.misc.color))
        .setDescription(`:bank: ${client.tls.phrase(user, "misc.banco.bufunfas")}\`\`\`${lang}\nB$ ${client.locale(user_interno.misc.money)}\`\`\`\n${daily}${extrato}`)

    if (user_interno.uid === interaction.user.id)
        embed.setFooter({
            text: client.tls.phrase(user, "misc.banco.dica_rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}