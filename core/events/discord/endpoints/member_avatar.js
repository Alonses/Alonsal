const { EmbedBuilder, AttachmentBuilder } = require('discord.js')

const Canvas = require('@napi-rs/canvas');

module.exports = async ({ client, guild, user, dados }) => {

    const user_alvo = dados[0].user
    let foto_antiga, foto_nova, attachment

    try { // Tentando gerar um canvas com as fotos alteradas
        const canvas = Canvas.createCanvas(1000, 500)
        const context = canvas.getContext('2d')

        // Carregando as imagens de perfil do usuário
        foto_antiga = await Canvas.loadImage(user.profile.avatar)
        foto_nova = await Canvas.loadImage(user_alvo.avatarURL({ dynamic: true }))

        // Desenhando no canvas
        context.drawImage(foto_antiga, 0, 0, 500, 500);
        context.drawImage(foto_nova, 500, 0, 500, 500);

        // Gerando a imagem para poder anexar ao canvas
        attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'avatar_change.png' })
    } catch {
        console.log("📛 | Erro ao carregar a imagem de perfil antiga de um usuário, continuando com apenas o avatar novo")
        attachment = null
    }

    user.profile.avatar = user_alvo.avatarURL({ dynamic: true })
    await user.save() // Atualizando a foto de perfil do usuário

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.titulo_avatar"))
        .setColor(0x29BB8E)
        .setDescription(client.tls.phrase(guild, "mode.logger.novo_avatar", 35))
        .setFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "util.server.membro")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: user_alvo.username
        })

    // Usuário é um BOT
    if (user_alvo.bot)
        embed.addFields(
            {
                name: `${client.emoji("icon_integration")} **${client.tls.phrase(guild, "util.user.bot")}**`,
                value: "⠀",
                inline: true
            }
        )

    if (attachment) {
        // Enviando o embed com a comparação entre imagens
        embed.setImage("attachment://avatar_change.png")

        client.notify(guild.logger.channel, { embed: embed, file: attachment })
    } else {

        // Enviando apenas a nova foto de perfil do usuário
        if (user_alvo.avatarURL({ dynamic: true }))
            embed.setThumbnail(user_alvo.avatarURL({ dynamic: true }))

        client.notify(guild.logger.channel, embed)
    }
}