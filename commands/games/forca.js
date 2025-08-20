const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, PermissionsBitField, InteractionContextType } = require('discord.js')

const { randomString } = require('../../core/functions/random_string')

const { padrao_forca } = require('../../core/formatters/patterns/game')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forca")
        .setDescription("⌠🎲|🇧🇷⌡ O jogo da forca!")
        .setContexts(InteractionContextType.Guild),
    async execute({ client, user, interaction }) {

        // Ignorando acionamento do jogo da forca em DM
        if (!interaction.guild) return

        if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles], interaction))
            return client.tls.reply(interaction, user, "game.forca.sem_permissao", true, 7)

        if (!client.cached.forca_sessao.has(client.encrypt(interaction.user.id))) {

            await interaction.deferReply({ flags: "Ephemeral" })

            fetch('https://api.dicionario-aberto.net/random')
                .then(res => res.json())
                .then(dados => {

                    const palavra_escolhida = dados.word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    const id_sessao = randomString(20, client).replaceAll(".", "")

                    client.cached.forca.set(id_sessao, {
                        word: palavra_escolhida,
                        descobertas: lista_posicoes(dados.word),
                        embed: null,
                        channel: interaction.channel.id,
                        erros: 0,
                        entradas: [],
                        finalizado: false
                    })

                    client.cached.forca_sessao.set(client.encrypt(interaction.user.id), { uid: client.encrypt(interaction.user.id), id_game: id_sessao })

                    retorna_jogo(client, interaction, id_sessao, user)
                })
        } else {

            // Verifica se o jogo ainda existe
            if (client.cached.forca_sessao.get(client.encrypt(interaction.user.id))) {

                const id_jogo = client.cached.forca_sessao.get(client.encrypt(interaction.user.id)).id_game
                retorna_jogo(client, interaction, id_jogo, user)
            }
        }
    }
}

function verifica_chute(client, message, entrada, id_jogo, user) {

    // Jogo expirado, removendo o usuário da sessão
    if (!client.cached.forca.has(id_jogo)) {
        message.channel.send({ content: client.tls.phrase(user, "game.forca.sessao_desconhecida") })
        client.cached.forca_sessao.delete(user.uid)
        return
    }

    // Ignora mensagens enviadas em outros canais
    if (client.cached.forca.get(id_jogo).channel !== message.channel.id) return

    const split = client.cached.forca.get(id_jogo).word.split("")

    let acerto = false
    let descobertas = client.cached.forca.get(id_jogo).descobertas.split(" ")

    // Removendo as mensagens enviadas no chat
    setTimeout(() => {
        message.delete().catch(() => console.error)
    }, 4000)

    if (entrada.length === 1) { // Chutando por letras

        // Barra caso a letra já tenha sido informada
        if (!client.cached.forca.get(id_jogo).entradas.includes(entrada)) {
            for (let i = 0; i < split.length; i++) {
                if (entrada === split[i]) {
                    descobertas[i] = `\`${entrada}\``

                    acerto = true
                }
            }

            client.cached.forca.get(id_jogo).entradas.push(entrada)
            client.cached.forca.get(id_jogo).descobertas = descobertas.join(" ")

            // Erro no chute por letra
            if (!acerto) client.cached.forca.get(id_jogo).erros++

            verifica_palavra(client, message, id_jogo, user, entrada)

            if (client.cached.forca.get(id_jogo).finalizado) {
                client.cached.forca.delete(id_jogo)

                // Removendo os membros da sessão finalizada
                client.cached.forca_sessao.forEach(user => {
                    if (user.id_game === id_jogo) client.cached.forca_sessao.delete(user.uid)
                })

                return
            }
        }
    } else { // Chute pela palavra inteira
        verifica_palavra(client, message, id_jogo, user, entrada)

        if (client.cached.forca.get(id_jogo).finalizado) {
            client.cached.forca.delete(id_jogo)

            // Removendo os membros da sessão finalizada
            client.cached.forca_sessao.forEach(user => {
                if (user.id_game === id_jogo) client.cached.forca_sessao.delete(user.uid)
            })

            return
        }
    }
}

async function verifica_palavra(client, interaction, id_jogo, user, entrada) {

    // Verifica se a palavra foi completa ou se o chute foi certeiro
    if (entrada === client.cached.forca.get(id_jogo).word || client.replace(client.cached.forca.get(id_jogo).descobertas, null, ["`", ""]).replaceAll(" ", "") === client.cached.forca.get(id_jogo).word) {
        interaction.channel.send({ content: `${client.emoji("emojis_negativos")} ${client.tls.phrase(user, "game.forca.acertou")} \`${client.cached.forca.get(id_jogo).word}\`\n\n${client.tls.phrase(user, "game.forca.bufunfas")}` })

        client.cached.forca.get(id_jogo).finalizado = true

        client.cached.forca_sessao.forEach(async user_interno => {

            if (user_interno.id_game === id_jogo) { // Distribuindo as recompensas aos membros da partida
                const user_data = await client.getUser(user_interno.uid)

                user_data.misc.money += 50
                await user_data.save()

                client.registryStatement(user_interno.uid, "misc.b_historico.jogos_forca", true, 50)
                client.journal("gerado", 50)
            }
        })

    } else if (entrada.length > 1 || client.cached.forca.get(id_jogo).erros >= 7) {
        interaction.channel.send({ content: `${client.emoji("emojis_dancantes")} ${client.tls.phrase(user, "game.forca.errou")} \`${client.cached.forca.get(id_jogo).word}\`` })

        client.cached.forca.get(id_jogo).finalizado = true
    } else
        retorna_jogo(client, interaction, id_jogo, user)
}

function lista_posicoes(palavra) {

    let array = []

    for (let i = 0; i < palavra.length; i++)
        array.push("`_`")

    return array.join(" ")
}

function painel_jogo(client, id_jogo) {
    return `\`\`\`${padrao_forca[client.cached.forca.get(id_jogo).erros]}\`\`\``
}

async function retorna_jogo(client, interaction, id_jogo, user) {

    let jogadores_sessao = 0

    client.cached.forca_sessao.forEach(user => {
        if (user.id_game === id_jogo) jogadores_sessao++
    })

    if (jogadores_sessao > 1) jogadores_sessao = client.tls.phrase(user, "game.forca.jogadores_sessao", null, jogadores_sessao)
    else jogadores_sessao = client.tls.phrase(user, "game.forca.jogador_sessao")

    if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], interaction)) {

        // Exclui a sessão e encerra o jogo
        client.cached.forca.delete(id_jogo)

        // Removendo os membros da sessão finalizada
        client.cached.forca_sessao.forEach(user => {
            if (user.id_game === id_jogo) client.cached.forca_sessao.delete(user.uid)
        })

        return
    }

    const painel = painel_jogo(client, id_jogo)
    let entradas = ""

    // Entradas que o foram enviadas no jogo
    if (client.cached.forca.get(id_jogo).entradas.length > 0)
        entradas = `\n${client.defaultEmoji("types")} ${client.tls.phrase(user, "game.forca.usado")}\`\`\`${client.cached.forca.get(id_jogo).entradas.join(", ")}\`\`\``

    const embed = client.create_embed({
        title: { tls: "game.forca.titulo" },
        description: `${client.cached.forca.get(id_jogo).descobertas} ( \`${(client.cached.forca.get(id_jogo).word).length} ${client.tls.phrase(user, "game.forca.letras")}\` )${painel} ${entradas}`,
        footer: `💠 ${client.tls.phrase(user, "game.forca.tentativas")} ${(7 - client.cached.forca.get(id_jogo).erros)}\n${client.defaultEmoji("person")} ${jogadores_sessao}`
    }, user)

    if (!client.cached.forca.get(id_jogo).embed) {

        const row = [
            { id: "forca_button", name: { tls: "menu.botoes.juntar_se" }, type: 0, emoji: client.emoji(25), data: `1.${id_jogo}` },
            { id: "forca_button", name: { tls: "menu.botoes.sair_da_sessao" }, type: 3, emoji: client.emoji(30), data: `2.${id_jogo}` }
        ]

        const message = await interaction.channel.send({ embeds: [embed], components: [client.create_buttons(row, interaction, user)] })
        client.cached.forca.get(id_jogo).embed = message

        client.tls.editReply(interaction, user, "game.forca.jogo_iniciado", true, 71)

    } else {

        client.cached.forca.get(id_jogo).embed.edit({ embeds: [embed] })

        if (interaction?.user?.id)
            client.tls.editReply(interaction, user, "game.forca.sessao_andamento", true, 71)
    }
}

module.exports.verifica_chute = verifica_chute