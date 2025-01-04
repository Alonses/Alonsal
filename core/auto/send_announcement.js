const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { getGameChannels, getSpecificGameChannel } = require('../database/schemas/Guild')

const { model_games } = require('../formatters/chunks/model_games')
const { redes } = require('../../files/json/text/anuncio.json')

module.exports = async ({ client, interaction, objetos_anunciados, guild_channel }) => {

    // Busca o canal espeficio ou todos os canais clientes para enviar o anúncio de jogo gratuito
    const canais_clientes = await (guild_channel ? getSpecificGameChannel(guild_channel) : getGameChannels())

    if (canais_clientes.length < 1)
        return client.notify(process.env.channel_feeds, { content: ":video_game: :octagonal_sign: | Anúncio de games cancelado, não há canais clientes registrados para receberem a atualização." })

    // Verificando se a plataforma informada é válida
    const matches = objetos_anunciados[0].link.match(client.cached.game_stores)

    if (!matches && interaction)
        return interaction.editReply({
            content: ":octagonal_sign: | Plataforma inválida, tente novamente.",
            flags: "Ephemeral"
        })

    let imagem_destaque, valor_anterior = 0, lista_links = []

    // Formatando o nome do jogo e escolhendo o banner para o anúncio
    objetos_anunciados.forEach(valor => {

        lista_links.push({
            name: valor.nome.length > 20 ? `${valor.nome.slice(0, 20)}...` : valor.nome,
            type: 4,
            value: valor.link
        })

        if (parseFloat(valor.preco) > valor_anterior || (parseInt(valor.preco) === 0 && objetos_anunciados.length === 1)) {
            valor_anterior = parseFloat(valor.preco)
            imagem_destaque = valor.thumbnail
        }

        if (valor.link.includes("store.steam") && !imagem_destaque)
            imagem_destaque = `https://cdn.akamai.steamstatic.com/steam/apps/${valor.link.split("app/")[1].split("/")[0]}/capsule_616x353.jpg`
    })

    // Objeto de anúncio para os jogos gratuitos
    const obj_anuncio = {
        guilds: canais_clientes,
        games: objetos_anunciados,
        banner: imagem_destaque,
        logo: client.emoji(redes[matches[0]][0]),
        plataforma: redes[matches[0]][1],
        row: lista_links
    }

    // Enviando a notificação para os canais clientes
    fragmenta_envio(client, obj_anuncio, parseInt(obj_anuncio.games.length / 3) - 1)

    // Acionado especificamente para um canal
    if (guild_channel) return

    let aviso = `:white_check_mark: | Aviso de Jogos gratuitos enviado para \`${canais_clientes.length}\` canais clientes`

    if (canais_clientes.length === 1)
        aviso = ":white_check_mark: | Aviso de Jogos gratuitos enviado para `1` canal cliente"

    client.notify(process.env.channel_feeds, { content: aviso })

    if (interaction)
        interaction.editReply({
            content: ":white_check_mark: | O anúncio foi enviado à todos os canais de games",
            flags: "Ephemeral"
        })
}

async function fragmenta_envio(client, obj_anuncio, indice) {

    // Previne que o indice seja negativo e pule o envio de games caso seja enviado menos que 3 titulos para anúncio
    indice = indice < 1 ? 0 : indice

    try {
        const dados = obj_anuncio.guilds[0]

        let idioma_definido = dados.lang ?? "pt-br"
        if (idioma_definido === "al-br") idioma_definido = "pt-br"

        const canal_alvo = client.discord.channels.cache.get(dados.games.channel)

        if (canal_alvo) { // Enviando os anúncios para os canais
            if (canal_alvo.type === 0 || canal_alvo.type === 5) {

                // Permissão para enviar mensagens no canal
                if (await client.permissions(null, client.id(), [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], canal_alvo)) {

                    // Enviando o anúncio
                    for (let i = 0; i <= indice; i++) {

                        // Formatando para enviar vários embeds caso necessário
                        const corpo_anuncio = formatar_modelo(client, obj_anuncio, client, dados, i, idioma_definido)
                        canal_alvo.send(corpo_anuncio)
                    }
                }
            }
        } else {
            if (client.id() === process.env.client_1) {
                // Canal ou servidor desconhecido ( funciona apenas no bot principal )
                dados.conf.games = false
                dados.save()
            }
        }
    } catch (err) {
        client.error(err, "Games")
    }

    // Removendo o 1° canal de anúncio
    obj_anuncio.guilds.shift()

    if (obj_anuncio.guilds.length > 0)
        setTimeout(() => { // Enviando o aviso de jogos gratuitos para o próximo canal
            fragmenta_envio(client, obj_anuncio, indice)
        }, 5000)
}

function formatar_modelo(client, obj_anuncio, client, dados, indice, idioma_definido) {

    if (obj_anuncio.games.length > 3) // Buscando o novo destaque
        obj_anuncio = busca_destaque(client, obj_anuncio, indice)

    const embed = new EmbedBuilder()
        .setTitle(`${obj_anuncio.logo} ${obj_anuncio.plataforma}`)
        .setColor(0x29BB8E)
        .setImage(obj_anuncio.banner)
        .setDescription(model_games(client, obj_anuncio.games.slice(indice * 3, (indice * 3) + 3), obj_anuncio.plataforma, idioma_definido))

    const obj_formatado = {
        content: indice === 0 ? `<@&${dados.games.role}>` : "",
        embeds: [embed],
        components: [client.create_buttons(obj_anuncio.row.slice(indice * 3, (indice * 3) + 3))]
    }

    return obj_formatado
}

function busca_destaque(client, obj_anuncio, indice) {

    const jogos_destaque = obj_anuncio.games.slice(indice * 3, (indice * 3) + 3)
    let imagem_destaque, valor_anterior = 0

    // Formatando o nome do jogo e escolhendo o banner para o anúncio
    jogos_destaque.forEach(game => {

        if (parseFloat(game.preco) > valor_anterior || (parseInt(game.preco) === 0 && jogos_destaque.length === 1)) {
            valor_anterior = parseFloat(game.preco)
            imagem_destaque = game.thumbnail
        }

        if (game.link.includes("store.steam") && !imagem_destaque)
            imagem_destaque = `https://cdn.akamai.steamstatic.com/steam/apps/${game.link.split("app/")[1].split("/")[0]}/capsule_616x353.jpg`
    })

    // Sem nenhum jogo qualificado, utilizando a capa do primeiro
    if (!imagem_destaque && jogos_destaque[0].preco === 0)
        imagem_destaque = jogos_destaque[0].thumbnail

    const matches = jogos_destaque[0].link.match(client.cached.game_stores)

    obj_anuncio.banner = imagem_destaque
    obj_anuncio.plataforma = redes[matches[0]][1]
    obj_anuncio.logo = client.emoji(redes[matches[0]][0])

    return obj_anuncio
}