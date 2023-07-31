const { EmbedBuilder } = require('discord.js')

const math = require('mathjs')

module.exports = async ({ client, user, interaction }) => {

    const operacao = interaction.options.getString("input")
    let raio = interaction.options.getNumber("value"), descricao = ''

    if (operacao === "1") { // Diâmetro

        descricao = `html\n${client.defaultEmoji("metrics")} Etapas\n\nEntrada, 🚫 Diâmetro = \`${client.locale(raio)}\`\nÉ necessário ajustar a fórmula do diâmetro para descobrir o raio.\n\nFórmula do diâmetro: d = r * 2\nFórmula ajustada: r = d / 2 (isola-se o raio)\nNa conta: r = ${client.locale(raio)} / 2`
        raio = raio / 2

        descricao += `\n↳ r = ${client.locale(raio)}`
    }

    if (operacao === "2") { // Perímetro

        descricao = `html\n${client.defaultEmoji("metrics")} Etapas\n\nEntrada, ⭕ Perímetro = \`${client.locale(raio)}\`\nÉ necessário ajustar a fórmula do perímetro para descobrir o raio.\n\nFórmula do perímetro: p = r * π * 2\nFórmula ajustada: r = p / (2 * π) (isola-se o raio)\nNa conta: r = ${client.locale(raio)} / (2 * π)`
        raio = raio / (2 * math.pi)

        descricao += `\n↳ r = ${client.locale(raio)}`
    }

    if (operacao === "3") { // Área

        descricao = `html\n${client.defaultEmoji("metrics")} Etapas\n\nEntrada, ⚪ Área = \`${client.locale(raio)}\`\nÉ necessário ajustar a fórmula da área para descobrir o raio.\n\nFórmula da área: a = π * r²\nFórmula ajustada: r² = a / π (isola-se o raio)\nNa conta: r² = ${client.locale(raio)} / π`
        raio = raio / math.pi

        descricao += `\n↳ r² = ${client.locale(raio)}\n\nApós, retiramos a raiz quadrada desse valor.\nSendo: r = √${client.locale(raio)}`
        raio = math.sqrt(raio)

        descricao += `\n↳ r = ${client.locale(raio)}`
    }

    if (descricao !== "")
        descricao = `\`\`\`${descricao}\n\nApós descobrir o raio, aplica-se as fórmulas abaixo\`\`\`\n`

    const embed = new EmbedBuilder()
        .setTitle("> Resultados")
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${descricao}🕛 **Raio:** \`${client.locale(raio)}\`\n\n🚫 **Diâmetro:** \`${client.locale(raio * 2)}\`\nFórmula: \`d = r * 2\`\n\n⭕ **Perímetro:** \`${client.locale(raio * math.pi * 2)}\`\nFórmula: \`p = r * π * 2\`\n\n⚪ **Área:** \`${client.locale(math.pi * raio * raio)}\`\nFórmula: \`a = π * r²\``)
        .setFooter({ text: "π = 3,1415...; r = raio; d = diâmetro; p = perímetro; a = área", iconURL: interaction.user.avatarURL({ dynamic: true }) })

    interaction.reply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}