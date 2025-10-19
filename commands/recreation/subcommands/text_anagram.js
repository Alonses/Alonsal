module.exports = async ({ client, user, interaction, texto_entrada, user_command }) => {

    let cor_embed = client.embed_color(user.misc.embed_color)

    const caracteres = duplicateCount(texto_entrada)
    const fatori = texto_entrada.split('')
    const fatori_fix = fatori
    let mult = 1, rept = 1

    for (let i = 1; i < fatori.length + 1; i++)
        mult *= i

    for (let i = 0; i < caracteres.length; i++) {
        let fatorial = 1

        if (caracteres[i] > 1) {
            for (let x = 1; x <= caracteres[i]; x++)
                fatorial *= x

            rept *= fatorial
        }
    }

    let result = mult

    if (rept > 1)
        result /= rept

    const anagrama_formado = []
    let exib_formatado = "", qtd_quebras = []
    const repeticoes = result > 3 ? 3 : result
    const combinacoes = result > 3 ? client.tls.phrase(user, "dive.anagrama.combinacoes") : client.tls.phrase(user, "dive.anagrama.combinacao")

    for (let i = 0; i < repeticoes; i++) {
        anagrama_formado.push(await client.execute("shuffleArray", { arr: fatori_fix }).join(''))

        exib_formatado += `**-** \`${anagrama_formado[i]}\`\n`
        qtd_quebras = exib_formatado.split(anagrama_formado[i])

        if (qtd_quebras.length > 2 && fatori_fix.length > 4)
            cor_embed = client.embed_color("amarelo")
    }

    if (cor_embed === client.embed_color("amarelo"))
        exib_formatado += `\n:four_leaf_clover: | _${client.tls.phrase(user, "dive.anagrama.sorte")}_`

    const anagrama = client.create_embed({
        title: `:abc: ${client.tls.phrase(user, "dive.anagrama.anagrama")}`,
        color: cor_embed,
        description: `${client.tls.phrase(user, "dive.anagrama.entrada")}: \`${texto_entrada}\`\n${client.tls.phrase(user, "dive.anagrama.lista_combinacoes")}:\n${exib_formatado}`,
        author: {
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        },
        footer: {
            text: `${client.tls.phrase(user, "dive.anagrama.sequencia")} ${client.execute("locale", { valor: result })} ${combinacoes}`
        }
    }, user)

    interaction.reply({
        embeds: [anagrama],
        flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
    })
}

duplicateCount = (texto_entrada) => {
    const charMap = {}

    for (const char of texto_entrada.toLowerCase())
        charMap[char] = (charMap[char] || 0) + 1

    return Object.values(charMap).filter((count) => count > 0)
}