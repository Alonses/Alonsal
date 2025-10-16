const { getUserStatements } = require('../../../core/database/schemas/User_statements')

module.exports = async ({ client, user, interaction }) => {

    const date1 = new Date()
    let alvo = interaction.options.getUser("user") || interaction.user
    let user_interno = await client.execute("getUser", { id_user: alvo.id })

    if (alvo.id === client.id())
        user_interno.misc.money = 1000000000000

    let daily = `${client.tls.phrase(user, "misc.banco.dica_comando")} ${client.emoji("emojis_dancantes")}`
    let titulo_embed = client.tls.phrase(user, "misc.banco.suas_bufunfas")

    if (alvo.id !== interaction.user.id)
        daily = "", titulo_embed = client.tls.phrase(user, "misc.banco.bufunfas_outros", null, alvo.username)

    let data_atual = date1.toDateString('pt-BR')
    if (data_atual == user.misc.daily && alvo.id === interaction.user.id) {
        const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((59 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

        daily = `${client.tls.phrase(user, "misc.banco.daily")} <t:${tempo_restante}:R>\n( <t:${tempo_restante}:f> )`
    }

    let lang = "fix", extrato = ""

    if (user_interno.misc.money < 0)
        lang = "diff"

    const embed = client.create_embed({
        title: titulo_embed,
        color: user_interno.misc.embed_color
    })

    if (interaction.user.id === alvo.id) {

        const movimentacoes = await getUserStatements(user_interno.uid)

        movimentacoes.forEach(movimentacao => {

            // Traduzindo a movimentação conforme o idioma do usuário
            let traducao = movimentacao.operation

            if (traducao) {
                if (movimentacao.operation.split(".").length > 2) // Modelo com string traduzível
                    traducao = client.tls.phrase(user, movimentacao.operation.split("|")[0], null, movimentacao.operation.includes("|") ? movimentacao.operation.split("|")[1] : null)

                extrato += `${!movimentacao.type ? "🔴 -" : "🟢 +"}B$ ${client.execute("locale", { valor: movimentacao.value })}, ${traducao}\n`
            }
        })

        if (extrato !== "")
            extrato = `${client.defaultEmoji("metrics")} **${client.tls.phrase(user, "misc.b_historico.movimentacoes")}**\`\`\`${extrato}\`\`\``

        if (interaction.user.id === alvo.id) {
            if (client.cached.subscribers.has(user.uid)) // Assinante
                extrato = `${extrato}${client.tls.phrase(user, "misc.assinante.frase_assinante", null, [user.misc.subscriber.expires ? `<t:${user.misc.subscriber.expires}:f>` : `\`${client.tls.phrase(user, "misc.assinante.assinatura_infinita")}\``, client.execute("getSubscriberDiscount")])}`
            else // Não assinante
                extrato = `${extrato}${client.tls.phrase(user, "misc.assinante.frase_nao_assinante", null, client.execute("getSubscriberDiscount"))}`
        }

        embed.setFooter({
            text: client.tls.phrase(user, "misc.banco.dica_rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })
    }

    embed.setDescription(`:bank: ${client.tls.phrase(user, "misc.banco.bufunfas")}\`\`\`${lang}\nB$ ${client.execute("locale", { valor: user_interno.misc.money })}\`\`\`\n${daily}\n\n${extrato}`)

    interaction.reply({
        embeds: [embed],
        flags: "Ephemeral"
    })
}