const { EmbedBuilder, AttachmentBuilder } = require('discord.js')

const Canvas = require('@napi-rs/canvas')

const usersmap = new Map()

module.exports = async ({ client, guild, user, dados }) => {

    const user_alvo = dados[0].user
    let foto_antiga, foto_nova, attachment, canvas

    try { // Tentando gerar um canvas com as fotos alteradas
        canvas = Canvas.createCanvas(680, 340)
        const context = canvas.getContext('2d')

        // Carregando as imagens de perfil do usuário
        foto_antiga = await Canvas.loadImage(user.profile.avatar)
        foto_nova = await Canvas.loadImage(user_alvo.displayAvatarURL())

        context.strokeStyle = '#29BB8E';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Desenhando no canvas
        context.drawImage(foto_antiga, 0, 0, 340, 340)
        context.drawImage(foto_nova, 340, 0, 340, 340)

        // Gerando a imagem para poder anexar ao canvas
        attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'new_avatar.png' })
    } catch { }

    user.profile.avatar = user_alvo.avatarURL({ dynamic: true })
    await user.save() // Atualizando a foto de perfil do usuário

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.titulo_avatar"))
        .setColor(0x29BB8E)
        .setDescription(client.tls.phrase(guild, "mode.logger.novo_avatar", 35))
        .setFields(
            {
                name: client.user_title(user_alvo, guild, "util.server.membro"),
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n${client.emoji("mc_name_tag")} \`${user_alvo.username}\`\n( <@${user_alvo.id}> )`,
                inline: true
            }
        )
        .setTimestamp()

    if (attachment) {
        // Enviando o embed com a comparação entre imagens
        embed.setImage("attachment://new_avatar.png")

        envia_logger(client, user.uid, { embeds: [embed], files: [attachment] })
    } else {

        // Enviando apenas a nova foto de perfil do usuário
        if (user_alvo.avatarURL({ dynamic: true }))
            embed.setImage(user_alvo.avatarURL({ dynamic: true }))

        envia_logger(client, user.uid, { embeds: [embed] })
    }
}

envia_logger = (client, id_alvo, objeto) => {

    if (!usersmap.has(id_alvo)) {

        usersmap.set(id_alvo, { cached: true })
        const guilds = client.guilds()

        guilds.forEach(async guild => {

            // Buscando as guilds com o evento de att de avatar ativo
            const internal_guild = await client.getGuild(guild.id)

            // Notificando a guild sobre a alteração do avatar de um membro
            if (internal_guild.logger.member_image && internal_guild.conf.logger) {
                const user = await guild.members.fetch(id_alvo)
                    .catch(() => { return null })

                if (user)
                    client.notify(internal_guild.logger.channel, objeto)
            }
        })

        setTimeout(() => {
            usersmap.delete(id_alvo)
        }, 5000)
    }
}