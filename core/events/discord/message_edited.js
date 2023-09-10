const { EmbedBuilder } = require('discord.js')

module.exports = async (client, message) => {

    // Verificando se o autor da mensagem editada é o bot
    if (message[0].partial || !client.x.logger) return
    if (message[0].author.bot) return

    // Mensagem com o mesmo conteúdo (links de gifs e imagens)
    if (message[0].content === message[1].content) return

    let guild = await client.getGuild(message[0].guildId)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0)) return

    // const alteracoes = comparar_edicoes(formata_text(message[0].content), formata_text(message[1].content))
    const alteracoes = {
        antigo: formata_text(message[0].content),
        novo: formata_text(message[1].content)
    }

    let texto = client.replace(client.tls.phrase(guild, "mode.logger.resumo_atualizado", client.emoji(39)), [message[0].url, message[0].author.id, alteracoes.antigo, alteracoes.novo])
    let autor = message[0].author.id, local = message[0].channelId, row

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.mensagem_editada"))
        .setColor(0xffffff)
        .setDescription(texto.slice(0, 4095))
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.logger.autor")}**`,
                value: `${client.emoji("icon_id")} \`${autor}\`\n( <@${autor}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("paper")} **${client.tls.phrase(guild, "util.rastreio.local")}**`,
                value: `${client.emoji("icon_id")} \`${local}\`\n( <#${local}> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: message[0].author.username
        })

    if (message[1].content.includes("https")) {
        const link_img = `https${message[1].content.split("https")[1].split(" ")[0]}`

        row = client.create_buttons([
            { name: client.tls.phrase(guild, "menu.botoes.navegador"), type: 4, emoji: "🌐", value: link_img }
        ])
    }

    if (row)
        client.notify(guild.logger.channel, { embed: embed, components: row })
    else
        client.notify(guild.logger.channel, embed)
}

function formata_text(texto) {
    return texto.replaceAll("`", "'")
}