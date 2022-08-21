const { AttachmentBuilder, PermissionsBitField } = require('discord.js')
const { canal_games } = require('../../arquivos/data/games/canal_games.json')
const formata_anun = require('./formatagames.js')

const platformMap = {
    "epicgames.com": [ "<:Logo_ep:864887054067957791>", "Epic" ],
    "store.steam": [ "<:Logo_st:864887020467257364>", "Steam" ],
    "gog.com": [ "<:Logo_gog:864887080673214505>", "GOG" ],
    "humblebundle.com": [ "<:Logo_hb:864887252587642911>", "Humble Bundle" ],
    "ubisoft.com": [ "<:Logo_ubi:864887154483134516>", "Ubisoft" ],
    "xbox.com" : ["<:Logo_xb:864886938322731058>", "Xbox"],
    "play.google" : ["<:logo_pst:973395673489756220>", "Google Play"]
}

module.exports = async (client, interaction, objeto_anunciado) => {

    const canais_clientes = []

    percorrer(canal_games)

    function percorrer(obj) { // Coleta os valores de canais e cargos
        for (const propriedade in obj) {
            if (obj.hasOwnProperty(propriedade)) {
                if (typeof obj[propriedade] == "object")
                    percorrer(obj[propriedade])
                else
                    canais_clientes.push(obj[propriedade])
            }
        }
    }
    
    const matches = objeto_anunciado.link.match(/epicgames.com|store.steam|gog.com|humblebundle.com|ubisoft.com|xbox.com|play.google/)

    if(!matches)
        return interaction.editReply({ content: "Plataforma inválida, tente novamente", ephemeral: true })

    const plataforma = platformMap[matches[0]][1]
    const logo_plat = platformMap[matches[0]][0]
    
    // Soma o valor dos jogos anunciados
    let valor_total = objeto_anunciado.preco

    const img_game = new AttachmentBuilder(objeto_anunciado.thumbnail)

    valor_total = valor_total.toFixed(2)
    let canais_recebidos = 0

    for (let i = 0; i < canais_clientes.length; i++) { // Envia a mensagem para vários canais clientes
        try {

            let servidor = await client.channels.cache.get(canais_clientes[i])

            let idioma_definido = await client.idioma.getLang(servidor)
            if(idioma_definido == "al-br") idioma_definido = "pt-br"
            
            let texto_anuncio = formata_anun(objeto_anunciado, logo_plat, plataforma, idioma_definido)
            
            if(typeof canais_clientes[i + 1] !== "undefined")
                texto_anuncio += ` <@&${canais_clientes[i + 1]}>`

            texto_anuncio += `\n<< <${objeto_anunciado.link}> >>`

            const canal_alvo = client.channels.cache.get(canais_clientes[i])

            // Enviando os anúncios para os canais
            if(canal_alvo.type === 0){        
                if(canal_alvo.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)){
                    canal_alvo.send({content: texto_anuncio, files: [img_game]}) // Permissão para enviar mensagens no canal
                
                    canais_recebidos++
                }
            }
        }catch(err){
            require('../../adm/internos/error.js')({client, err})
        }

        i++
    }
    
    let aviso = `:white_check_mark: | Aviso de Jogo gratuito enviado para \`${canais_recebidos}\` canais clientes`

    if(canais_recebidos === 1)
        aviso = `:white_check_mark: | Aviso de Jogo gratuito enviado para \`${canais_recebidos}\` canal cliente`

    client.channels.cache.get('872865396200452127').send(aviso)

    return interaction.editReply({ content: "A atualização foi enviada à todos os canais de games", ephemeral: true })
}