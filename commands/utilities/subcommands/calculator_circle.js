const math = require('mathjs')

module.exports = async ({ client, user, interaction }) => {

    await interaction.deferReply({ flags: "Ephemeral" })

    const operacao = interaction.options.getString("input")
    let raio = interaction.options.getNumber("value"), descricao = ''

    if (operacao === "1") { // Diâmetro

        descricao = `html\n${client.defaultEmoji("metrics")} ${client.tls.phrase(user, "util.calc.etapas_entrada")} 🚫 ${client.tls.phrase(user, "util.calc.diametro")} = ${client.execute("locale", { valor: raio })}\n${client.tls.phrase(user, "util.calc.ajustar_diametro")}\n\n${client.tls.phrase(user, "util.calc.formula_diametro")}: d = r * 2\n${client.tls.phrase(user, "util.calc.formula_ajustada")}: r = d / 2 (${client.tls.phrase(user, "util.calc.isolase_raio")})\n${client.tls.phrase(user, "util.calc.na_conta")}: r = ${client.execute("locale", { valor: raio })} / 2`

        raio = raio / 2
        descricao += `\n↳ r = ${client.execute("locale", { valor: raio })}`
    }

    if (operacao === "2") { // Perímetro

        descricao = `html\n${client.defaultEmoji("metrics")} ${client.tls.phrase(user, "util.calc.etapas_entrada")} ⭕ ${client.tls.phrase(user, "util.calc.perimetro")} = ${client.execute("locale", { valor: raio })}\n${client.tls.phrase(user, "util.calc.ajustar_perimetro")}\n\n${client.tls.phrase(user, "util.calc.formula_perimetro")}: p = r * π * 2\n${client.tls.phrase(user, "util.calc.formula_ajustada")}: r = p / (2 * π) (${client.tls.phrase(user, "util.calc.isolase_raio")})\n${client.tls.phrase(user, "util.calc.na_conta")}: r = ${client.execute("locale", { valor: raio })} / (2 * π)`

        raio = raio / (2 * math.pi)
        descricao += `\n↳ r = ${client.execute("locale", { valor: raio })}`
    }

    if (operacao === "3") { // Área

        descricao = `html\n${client.defaultEmoji("metrics")} ${client.tls.phrase(user, "util.calc.etapas_entrada")} ⚪ ${client.tls.phrase(user, "util.calc.area")} = ${client.execute("locale", { valor: raio })}\n${client.tls.phrase(user, "util.calc.ajustar_area")}\n\n${client.tls.phrase(user, "util.calc.formula_area")}: a = π * r²\n${client.tls.phrase(user, "util.calc.formula_ajustada")}: r² = a / π (${client.tls.phrase(user, "util.calc.isolase_raio")})\n${client.tls.phrase(user, "util.calc.na_conta")}: r² = ${client.execute("locale", { valor: raio })} / π`

        raio = raio / math.pi
        descricao += `\n↳ r² = ${client.execute("locale", { valor: raio })}\n\n${client.tls.phrase(user, "util.calc.tirar_raiz")}: r = √${client.execute("locale", { valor: raio })}`
        raio = math.sqrt(raio)

        descricao += `\n↳ r = ${client.execute("locale", { valor: raio })}`
    }

    if (descricao !== "")
        descricao = `\`\`\`${descricao}\n\n${client.tls.phrase(user, "util.calc.formulas_abaixo")}\`\`\`\n`

    const embed = client.create_embed({
        title: { tls: "util.calc.resultados" },
        description: `${descricao}🕛 **${client.tls.phrase(user, "util.calc.raio")}:** \`${client.execute("locale", { valor: raio })}\`\n\n🚫 **${client.tls.phrase(user, "util.calc.diametro")}:** \`${client.execute("locale", { valor: raio * 2 })}\`\n${client.tls.phrase(user, "util.calc.formula")}: \`d = r * 2\`\n\n⭕ **${client.tls.phrase(user, "util.calc.perimetro")}:** \`${client.execute("locale", { valor: raio * math.pi * 2 })}\`\n${client.tls.phrase(user, "util.calc.formula")}: \`p = r * π * 2\`\n\n⚪ **${client.tls.phrase(user, "util.calc.area")}:** \`${client.execute("locale", { valor: math.pi * raio * raio })}\`\n${client.tls.phrase(user, "util.calc.formula")}: \`a = π * r²\``,
        footer: {
            text: (`π = 3,1415...; r = ${client.tls.phrase(user, "util.calc.raio")}; d = ${client.tls.phrase(user, "util.calc.diametro")}; p = ${client.tls.phrase(user, "util.calc.perimetro")}; a = ${client.tls.phrase(user, "util.calc.area")}`).toLowerCase(),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    interaction.editReply({
        embeds: [embed],
        flags: "Ephemeral"
    })
}