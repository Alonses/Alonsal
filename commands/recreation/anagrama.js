const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anagram")
        .setNameLocalizations({
            "de": 'anagramm',
            "es-ES": 'anagrama',
            "fr": 'anagramme',
            "it": 'anagramma',
            "pt-BR": 'anagrama',
            "ru": 'анаграмма'
        })
        .setDescription("⌠😂⌡ Generates anagrams based on input")
        .setDescriptionLocalizations({
            "de": '⌠😂⌡ Erzeugt Anagramme basierend auf Ihrem Text',
            "es-ES": '⌠😂⌡ Genera anagramas basados ​​en la entrada',
            "fr": '⌠😂⌡ Génère des anagrammes basés sur l\'entrée',
            "it": '⌠😂⌡ Genera anagrammi in base all\'input',
            "pt-BR": '⌠😂⌡ Gera anagramas com base na entrada',
            "ru": '⌠😂⌡ Генерирует анаграммы на основе ввода'
        })
        .addStringOption(option =>
            option.setName("text")
                .setNameLocalizations({
                    "es-ES": 'texto',
                    "fr": 'texte',
                    "it": 'testo',
                    "pt-BR": 'texto',
                    "ru": 'текст'
                })
                .setDescription("Write something!")
                .setDescriptionLocalizations({
                    "de": 'Schreibe etwas!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!',
                    "it": 'Scrivi qualcosa!',
                    "pt-BR": 'Escreva algo!',
                    "ru": 'Напиши что-нибудь!'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

        const texto_entrada = interaction.options.getString("text")
        let cor_embed = client.embed_color(user.misc.color)

        const caracteres = duplicateCount(texto_entrada)
        const fatori = texto_entrada.split('')
        const fatori_fix = fatori
        let mult = 1, rept = 1

        for (let i = 1; i < fatori.length + 1; i++) {
            mult *= i
        }

        for (let i = 0; i < caracteres.length; i++) {
            let fatorial = 1

            if (caracteres[i] > 1) {
                for (let x = 1; x <= caracteres[i]; x++) {
                    fatorial *= x
                }

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
            anagrama_formado.push(await client.shuffleArray(fatori_fix).join(''))

            exib_formatado += `**-** \`${anagrama_formado[i]}\`\n`
            qtd_quebras = exib_formatado.split(anagrama_formado[i])

            if (qtd_quebras.length > 2 && fatori_fix.length > 4)
                cor_embed = "0xfbff3d"
        }

        if (cor_embed === "0xfbff3d")
            exib_formatado += `\n:four_leaf_clover: | _${client.tls.phrase(user, "dive.anagrama.sorte")}_`

        const anagrama = new EmbedBuilder()
            .setTitle(`:abc: ${client.tls.phrase(user, "dive.anagrama.anagrama")}`)
            .setColor(cor_embed)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })
            .setDescription(`${client.tls.phrase(user, "dive.anagrama.entrada")}: \`${texto_entrada}\`\n${client.tls.phrase(user, "dive.anagrama.lista_combinacoes")}:\n${exib_formatado}`)
            .setFooter({
                text: `${client.tls.phrase(user, "dive.anagrama.sequencia")} ${client.locale(result)} ${combinacoes}`
            })

        interaction.reply({
            embeds: [anagrama],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }
}

function duplicateCount(texto_entrada) {
    const charMap = {}

    for (const char of texto_entrada.toLowerCase())
        charMap[char] = (charMap[char] || 0) + 1

    return Object.values(charMap).filter((count) => count > 0)
}