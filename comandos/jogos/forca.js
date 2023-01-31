const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const games = new Map()

const padrao = {
    0: "┌———\n│\n│\n│",
    1: "┌———\n│  O\n│\n│",
    2: "┌———\n│  O\n│  |\n│",
    3: "┌———\n│  O\n│ /|\n│",
    4: "┌———\n│  O\n│ /|\\\n│",
    5: "┌———\n│  O\n│ /|\\\n│ /",
    6: "┌———\n│  O\n│ /|\\\n│ / \\"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forca')
        .setDescription('⌠🎲⌡ O jogo da forca!')
        .addStringOption(option =>
            option.setName("entrada")
                .setDescription("Uma letra ou a palavra inteira!")),
    async execute(client, user, interaction) {

        if (!games[interaction.user.id]) {
            fetch('https://api.dicionario-aberto.net/random')
                .then(res => res.json())
                .then(dados => {

                    games[interaction.user.id] = {
                        word: dados.word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
                        descobertas: lista_posicoes(dados.word),
                        erros: 0,
                        entradas: []
                    }

                    retorna_jogo(client, interaction, user)
                })
        } else {

            // Acionado caso seja escrito algo para o chute da palavra
            if (interaction.options.data.length == 1) {
                const entrada = interaction.options.data[0].value.toLowerCase()

                verifica_chute(entrada, interaction, user)
            }

            // Verifica se o jogo ainda existe
            if (games[interaction.user.id])
                retorna_jogo(client, interaction, user)
        }
    }
}

function verifica_chute(entrada, interaction, user) {

    const split = games[interaction.user.id].word.split("")

    let acerto = false
    let descobertas = games[interaction.user.id].descobertas.split(" ")

    if (entrada.length == 1) { // Chutando por letras
        for (let i = 0; i < split.length; i++) {
            if (entrada == split[i]) {
                descobertas[i] = `\`${entrada}\``;

                acerto = true
            }
        }

        games[interaction.user.id].entradas.push(entrada)
        games[interaction.user.id].descobertas = descobertas.join(" ")

        if (!acerto)
            games[interaction.user.id].erros++

        if (games[interaction.user.id].erros == 6) {
            interaction.reply({ content: `Você perdeu!\nA palavra era \`${games[interaction.user.id].word}\``, ephemeral: user.misc.ghost_mode })

            delete games[interaction.user.id]
        }
    } else { // Chute pela palavra inteira
        if (entrada == games[interaction.user.id].word || games[interaction.user.id].descobertas.join("").replaceAll("`", "").replaceAll(" ", "") == games[interaction.user.id].word)
            interaction.reply({ content: `Você acertou! Parabéns!\nA palavra era \`${games[interaction.user.id].word}\``, ephemeral: user.misc.ghost_mode })
        else
            interaction.reply({ content: `Você perdeu!\nA palavra era \`${games[interaction.user.id].word}\``, ephemeral: user.misc.ghost_mode })

        delete games[interaction.user.id]
    }
}

function lista_posicoes(palavra) {

    let array = []

    for (let i = 0; i < palavra.length; i++)
        array.push("`_`")

    return array.join(" ")
}

function painel_jogo(interaction) {
    return `\`\`\`${padrao[games[interaction.user.id].erros]}\`\`\``
}

function retorna_jogo(client, interaction, user) {

    const painel = painel_jogo(interaction)
    let entradas = ""

    // Entradas que o usuário tentou
    if (games[interaction.user.id].entradas.length > 0)
        entradas = `\nLetras já usadas\`\`\`${games[interaction.user.id].entradas.join(", ")}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle("> Jogo da forca :skull:")
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${games[interaction.user.id].descobertas} ${painel} ${entradas}\nUse </forca:1069762590294687905> com uma letra ou a palavra toda para tentar acertar!`)
        .setFooter({ text: `Tentativas restantes: ${(7 - games[interaction.user.id].erros)}` })

    interaction.reply({ embeds: [embed], ephemeral: user.misc.ghost_mode })
}