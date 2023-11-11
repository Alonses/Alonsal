const { EmbedBuilder } = require('discord.js')
// const compare_messages = require('../../../auto/compare_messages')

module.exports = async (client, message) => {

    // Verificando se o autor da mensagem editada é o bot
    if (message[0].partial || message[0].author.bot) return

    // Mensagem com o mesmo conteúdo (links de gifs e imagens)
    if (message[0].content === message[1].content) return

    const guild = await client.getGuild(message[0].guildId)

    // Verificando se a guild habilitou o logger
    if (!guild.logger.message_edit || !guild.conf.logger) return

    // const alteracoes = comparar_edicoes(formata_text(message[0].content), formata_text(message[1].content))
    const alteracoes = {
        antigo: client.replace(message[0].content, null, ["`", "'"]),
        novo: client.replace(message[1].content, null, ["`", "'"])
    }

    // Relatório resumido das alterações entre as mensagens
    if (alteracoes.antigo.length > 50 || alteracoes.novo.length > 50) {

        // const relatorio_alteracoes = compare_messages(alteracoes.antigo, alteracoes.novo)

        // alteracoes.antigo = relatorio_alteracoes.antigo.join("\n\n")
        // alteracoes.novo = relatorio_alteracoes.novo.join("\n\n")
    }

    let texto = client.replace(client.tls.phrase(guild, "mode.logger.resumo_atualizado", client.emoji(39)), [message[0].url, message[0].author.id, (alteracoes.antigo).slice(0, 500), alteracoes.novo.slice(0, 500)])
    let autor = message[0].author.id, local = message[0].channelId, row

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.mensagem_editada"))
        .setColor(0xffffff)
        .setDescription(texto)
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
        client.notify(guild.logger.channel, { embeds: [embed], components: [row] })
    else
        client.notify(guild.logger.channel, { embeds: [embed] })
}