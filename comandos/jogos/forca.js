const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { createStatement } = require('../../adm/database/schemas/Statement')

const { emojis_negativos, emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

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
        .setName("forca")
        .setDescription("⌠🎲|🇧🇷⌡ O jogo da forca!")
        .addStringOption(option =>
            option.setName("entrada")
                .setDescription("Uma letra ou a palavra inteira!")),
    async execute(client, user, interaction) {

        if (!games[interaction.user.id]) {
            fetch('https://api.dicionario-aberto.net/random')
                .then(res => res.json())
                .then(dados => {

                    const palavra_escolhida = dados.word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")

                    games[interaction.user.id] = {
                        word: palavra_escolhida,
                        descobertas: lista_posicoes(dados.word),
                        erros: 0,
                        entradas: [],
                        finalizado: false
                    }

                    retorna_jogo(client, interaction, user)
                })
        } else {

            // Acionado caso seja escrito algo para o chute da palavra
            if (interaction.options.data.length === 1) {
                const entrada = interaction.options.getString("entrada").toLowerCase()

                verifica_chute(client, entrada, interaction, user)
            }

            // Verifica se o jogo ainda existe
            if (games[interaction.user.id])
                retorna_jogo(client, interaction, user)
        }
    }
}

function verifica_chute(client, entrada, interaction, user) {

    const split = games[interaction.user.id].word.split("")

    let acerto = false
    let descobertas = games[interaction.user.id].descobertas.split(" ")

    if (entrada.length === 1) { // Chutando por letras

        // Barra caso a letra já tenha sido informada
        if (!games[interaction.user.id].entradas.includes(entrada)) {
            for (let i = 0; i < split.length; i++) {
                if (entrada === split[i]) {
                    descobertas[i] = `\`${entrada}\``

                    acerto = true
                }
            }

            games[interaction.user.id].entradas.push(entrada)
            games[interaction.user.id].descobertas = descobertas.join(" ")

            if (!acerto)
                games[interaction.user.id].erros++

            verifica_palavra(client, interaction, user, entrada)

            if (games[interaction.user.id].finalizado) {
                delete games[interaction.user.id]
                return
            }
        }
    } else { // Chute pela palavra inteira
        verifica_palavra(client, interaction, user, entrada)

        if (games[interaction.user.id].finalizado) {
            delete games[interaction.user.id]
            return
        }
    }
}

async function verifica_palavra(client, interaction, user, entrada) {

    // Verifica se a palavra foi completa ou se o chute foi certeiro
    if (entrada === games[interaction.user.id].word || games[interaction.user.id].descobertas.replaceAll("`", "").replaceAll(" ", "") === games[interaction.user.id].word) {
        interaction.reply({ content: `${client.emoji(emojis_negativos)} ${client.tls.phrase(user, "game.forca.acertou")} \`${games[interaction.user.id].word}\`\n\nVocê ganhou \`B$ 50\` Bufunfas pelo acerto!`, ephemeral: client.decider(user?.conf.ghost_mode, 0) })

        games[interaction.user.id].finalizado = true

        user.misc.money += 50
        await user.save()

        createStatement(user.uid, `Jogos e entretenimento (forca)`, true, 50, client.timestamp())

    } else if (entrada.length > 1 || games[interaction.user.id].erros >= 7) {
        interaction.reply({ content: `${client.emoji(emojis_dancantes)} ${client.tls.phrase(user, "game.forca.errou")} \`${games[interaction.user.id].word}\``, ephemeral: client.decider(user?.conf.ghost_mode, 0) })

        games[interaction.user.id].finalizado = true
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

async function retorna_jogo(client, interaction, user) {

    const painel = painel_jogo(interaction)
    let entradas = ""

    // Entradas que o usuário tentou
    if (games[interaction.user.id].entradas.length > 0)
        entradas = `\n${client.tls.phrase(user, "game.forca.usado")}\`\`\`${games[interaction.user.id].entradas.join(", ")}\`\`\``

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "game.forca.titulo"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${games[interaction.user.id].descobertas} ${painel} ${entradas}\n${client.tls.phrase(user, "game.forca.comando")}`)
        .setFooter({ text: `${client.tls.phrase(user, "game.forca.tentativas")} ${(7 - games[interaction.user.id].erros)}` })

    interaction.reply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}