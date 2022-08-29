const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const formata_anun = require('./formata_games.js')

const platformMap = {
    "epicgames.com": [ "<:Logo_ep:864887054067957791>", "Epic Games" ],
    "store.steam": [ "<:Logo_st:864887020467257364>", "Steam" ],
    "gog.com": [ "<:Logo_gog:864887080673214505>", "GOG" ],
    "humblebundle.com": [ "<:Logo_hb:864887252587642911>", "Humble Bundle" ],
    "ubisoft.com": [ "<:Logo_ubi:864887154483134516>", "Ubisoft" ],
    "xbox.com" : ["<:Logo_xb:864886938322731058>", "Xbox"],
    "play.google" : ["<:logo_pst:973395673489756220>", "Google Play"]
}

module.exports = async ({client, interaction, objetos_anunciado}) => {

    const canais_clientes = []
    const { canal_games } = require('../../arquivos/data/games/canal_games.json')

    percorrer(canal_games)

    function percorrer(obj) { // Coleta os valores de canais e cargos para anunciar
        for (const propriedade in obj) {
            if (obj.hasOwnProperty(propriedade)) {
                if (typeof obj[propriedade] == "object")
                    percorrer(obj[propriedade])
                else
                    canais_clientes.push(obj[propriedade])
            }
        }
    }
    
    const matches = objetos_anunciado[0].link.match(/epicgames.com|store.steam|gog.com|humblebundle.com|ubisoft.com|xbox.com|play.google/)

    if (!matches && interaction)
        return interaction.editReply({ content: "Plataforma inválida, tente novamente", ephemeral: true })

    const plataforma = platformMap[matches[0]][1], logo_plat = platformMap[matches[0]][0]
    let canais_recebidos = 0, marcacao = '⠀'
    
    const row = new ActionRowBuilder()

    objetos_anunciado.forEach(valor => {
        let nome_jogo = valor.nome.length > 20 ? `${valor.nome.slice(0, 20)}...` : valor.nome

        row.addComponents(
            new ButtonBuilder()
            .setLabel(nome_jogo)
            .setURL(valor.link)
            .setStyle(ButtonStyle.Link),
        )
    })

    for (let i = 0; i < canais_clientes.length; i++) { // Envia a mensagem para vários canais clientes
        try {
            let servidor = await client.channels.cache.get(canais_clientes[i])
            let cor_embed = 0x29BB8E

            let idioma_definido = await client.idioma.getLang(servidor)
            if (idioma_definido == "al-br") idioma_definido = "pt-br"
            
            let texto_anuncio = formata_anun(objetos_anunciado, plataforma, idioma_definido)
            
            if(typeof canais_clientes[i + 1] !== "undefined")
                marcacao = `<@&${canais_clientes[i + 1]}>`

            const embed = new EmbedBuilder()
            .setTitle(`${logo_plat} ${plataforma}`)
            .setImage(objetos_anunciado[0].thumbnail)
            .setColor(cor_embed)
            .setDescription(texto_anuncio)
            
            const canal_alvo = client.channels.cache.get(canais_clientes[i])

            // Enviando os anúncios para os canais
            if (canal_alvo.type === 0 || canal_alvo.type === 5){        
                if (canal_alvo.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)){
                    canal_alvo.send({ content: marcacao, embeds: [embed], components: [row] }) // Permissão para enviar mensagens no canal
                    
                    canais_recebidos++
                }
            }
        }catch(err){
            require('../../adm/internos/error.js')({client, err})
        }

        i++
    }
    
    let aviso = `:white_check_mark: | Aviso de Jogo gratuito enviado para \`${canais_recebidos}\` canais clientes`

    if (canais_recebidos === 1)
        aviso = `:white_check_mark: | Aviso de Jogo gratuito enviado para \`${canais_recebidos}\` canal cliente`

    client.channels.cache.get('872865396200452127').send(aviso)

    if (interaction)
        return interaction.editReply({ content: "A atualização foi enviada à todos os canais de games", ephemeral: true })
}