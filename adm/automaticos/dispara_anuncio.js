const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const create_buttons = require('../discord/create_buttons.js')
const formata_anun = require('../formatadores/formata_games.js')

const { redes } = require('../../arquivos/json/text/anuncio.json')

module.exports = async ({ client, interaction, objetos_anunciados }) => {

    const canais_clientes = await client.getGameChannels()

    if (objetos_anunciados.status === 501) {
        client.notify(process.env.feeds_channel, ":stop_sign: | Houve um problema com o anúncio automático, verifique a APISAL.")
        return
    }

    if (canais_clientes.length < 1)
        return client.notify(process.env.feeds_channel, ":video_game: | Anúncio de games cancelado, não há canais clientes registrados para receberem a atualização")

    // Verificando se a plataforma informada é válida
    const matches = objetos_anunciados[0].link.match(/epicgames.com|store.steam|gog.com|humblebundle.com|ubisoft.com|store.ubi.com|xbox.com|play.google|microsoft.com/)

    if (!matches && interaction)
        return interaction.editReply({ content: ":octagonal_sign: | Plataforma inválida, tente novamente", ephemeral: true })

    const plataforma = redes[matches[0]][1], logo_plat = redes[matches[0]][0]
    let canais_recebidos = 0, imagem_destaque, valor_anterior = 0
    let lista_links = []

    objetos_anunciados.forEach(valor => {
        let nome_jogo = valor.nome.length > 20 ? `${valor.nome.slice(0, 20)}...` : valor.nome

        lista_links.push({ name: nome_jogo, type: 4, value: valor.link })

        if (parseFloat(valor.preco) > valor_anterior || (parseInt(valor.preco) === 0 && objetos_anunciados.length === 1)) {
            valor_anterior = parseFloat(valor.preco)
            imagem_destaque = valor.thumbnail
        }

        if (valor.link.includes("store.steam") && !imagem_destaque)
            imagem_destaque = `https://cdn.akamai.steamstatic.com/steam/apps/${valor.link.split("app/")[1].split("/")[0]}/capsule_616x353.jpg`
    })

    // Criando os botões externos para os jogos
    const row = create_buttons(lista_links)

    // Enviando a notificação para vários os canais clientes
    canais_clientes.forEach(dados => {

        try {
            let cor_embed = 0x29BB8E

            let idioma_definido = dados.lang || "pt-br"
            if (idioma_definido === "al-br") idioma_definido = "pt-br"

            let texto_anuncio = formata_anun(client, objetos_anunciados, plataforma, idioma_definido)
            marcacao = `<@&${dados.games.role}>`

            const embed = new EmbedBuilder()
                .setTitle(`${logo_plat} ${plataforma}`)
                .setColor(cor_embed)
                .setImage(imagem_destaque)
                .setDescription(texto_anuncio)

            const canal_alvo = client.discord.channels.cache.get(dados.games.channel)

            // Enviando os anúncios para os canais
            if (canal_alvo.type === 0 || canal_alvo.type === 5) {
                if (canal_alvo.permissionsFor(client.discord.user).has(PermissionsBitField.Flags.SendMessages) && canal_alvo.permissionsFor(client.discord.user).has(PermissionsBitField.Flags.ViewChannel)) {
                    canal_alvo.send({ content: marcacao, embeds: [embed], components: [row] }) // Permissão para enviar mensagens no canal

                    canais_recebidos++
                }
            }
        } catch (err) {
            require('../eventos/error.js')({ client, err })
        }
    })

    let aviso = `:white_check_mark: | Aviso de Jogos gratuitos enviado para \`${canais_recebidos}\` canais clientes`

    if (canais_recebidos === 1)
        aviso = `:white_check_mark: | Aviso de Jogos gratuitos enviado para \`${canais_recebidos}\` canal cliente`

    client.notify(process.env.feeds_channel, aviso)

    if (interaction)
        interaction.editReply({ content: ":white_check_mark: | A atualização foi enviada à todos os canais de games", ephemeral: true })
}