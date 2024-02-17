const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { model_games } = require('../formatters/chunks/model_games')

const { redes } = require('../../files/json/text/anuncio.json')

module.exports = async ({ client, interaction, objetos_anunciados, guild_channel }) => {

    const canais_clientes = await client.getGameChannels()

    if (canais_clientes.length < 1)
        return client.notify(process.env.channel_feeds, { content: ":video_game: :octagonal_sign: | Anúncio de games cancelado, não há canais clientes registrados para receberem a atualização." })

    // Verificando se a plataforma informada é válida
    const matches = objetos_anunciados[0].link.match(/epicgames.com|store.steam|gog.com|humblebundle.com|ubisoft.com|store.ubi.com|xbox.com|play.google|beta.bandainamcoent|microsoft.com/)

    if (!matches && interaction)
        return interaction.editReply({
            content: ":octagonal_sign: | Plataforma inválida, tente novamente.",
            ephemeral: true
        })

    const plataforma = redes[matches[0]][1], logo_plat = redes[matches[0]][0]
    let canais_recebidos = 0, imagem_destaque, valor_anterior = 0, lista_links = []

    objetos_anunciados.forEach(valor => {
        let nome_jogo = valor.nome.length > 20 ? `${valor.nome.slice(0, 20)}...` : valor.nome

        lista_links.push({
            name: nome_jogo,
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

    // Criando os botões externos para os jogos
    const row = client.create_buttons(lista_links)

    // Enviando a notificação para vários os canais clientes
    canais_clientes.forEach(async dados => {

        try {
            let idioma_definido = dados.lang ?? "pt-br"
            if (idioma_definido === "al-br") idioma_definido = "pt-br"

            let texto_anuncio = model_games(client, objetos_anunciados, plataforma, idioma_definido)

            const embed = new EmbedBuilder()
                .setTitle(`${logo_plat} ${plataforma}`)
                .setColor(0x29BB8E)
                .setImage(imagem_destaque)
                .setDescription(texto_anuncio)

            const canal_alvo = client.discord.channels.cache.get(dados.games.channel)

            if (canal_alvo) { // Enviando os anúncios para os canais
                if (canal_alvo.type === 0 || canal_alvo.type === 5) {

                    // Permissão para enviar mensagens no canal
                    if (await client.permissions(null, client.id(), [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel], canal_alvo)) {

                        if (typeof guild_channel === "undefined") // Anúnciando em todos os servidores
                            canal_alvo.send({
                                content: `<@&${dados.games.role}>`,
                                embeds: [embed],
                                components: [row]
                            })
                        else if (guild_channel === dados.games.channel) // Anúnciando apenas no servidor alvo
                            canal_alvo.send({
                                content: `<@&${dados.games.role}>`,
                                embeds: [embed],
                                components: [row]
                            })

                        canais_recebidos++
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
    })

    if (typeof guild_channel !== "undefined")
        return

    let aviso = `:white_check_mark: | Aviso de Jogos gratuitos enviado para \`${canais_recebidos}\` canais clientes`

    if (canais_recebidos === 1)
        aviso = ":white_check_mark: | Aviso de Jogos gratuitos enviado para `1` canal cliente"

    client.notify(process.env.channel_feeds, { content: aviso })

    if (interaction)
        interaction.editReply({
            content: ":white_check_mark: | A atualização foi enviada à todos os canais de games",
            ephemeral: true
        })
}