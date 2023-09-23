const { EmbedBuilder, AttachmentBuilder } = require('discord.js')

const Canvas = require('@napi-rs/canvas')

const usersmap = new Map()

module.exports = async ({ client, guild, user, dados }) => {

    const user_alvo = dados[0].user
    let foto_antiga, foto_nova, attachment, canvas

    try { // Tentando gerar um canvas com as fotos alteradas
        canvas = Canvas.createCanvas(1000, 500)
        const context = canvas.getContext('2d')

        // Carregando as imagens de perfil do usuário
        foto_antiga = await Canvas.loadImage(user.profile.avatar)
        foto_nova = await Canvas.loadImage(user_alvo.avatarURL({ dynamic: true }))

        // Desenhando no canvas
        context.drawImage(foto_antiga, 0, 0, 500, 500);
        context.drawImage(foto_nova, 500, 0, 500, 500);

        // Gerando a imagem para poder anexar ao canvas
        attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'new_avatar.png' })
    } catch {
        console.log("📛 | Erro ao carregar a imagem de perfil antiga de um usuário, continuando com apenas o avatar novo")
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
        embed.setImage("attachment://new_avatar.png")

        envia_logger(client, user.uid, { embed: embed, file: attachment })
    } else {

        // Enviando apenas a nova foto de perfil do usuário
        if (user_alvo.avatarURL({ dynamic: true }))
            embed.setImage(user_alvo.avatarURL({ dynamic: true }))

        envia_logger(client, user.uid, embed)
    }
}

envia_logger = (client, id_alvo, valor) => {

    if (!usersmap.has(id_alvo)) {

        usersmap.set(id_alvo, { cached: true })
        const guilds = client.guilds()

        guilds.forEach(async guild => {

            // Buscando as guilds com o log ativo
            const internal_guild = await client.getGuild(guild.id)

            if (internal_guild.conf.logger) {
                const user = await guild.members.fetch(id_alvo)
                    .catch(() => { return null })

                if (user) // Notificando a guild sobre a alteração da foto de um membro
                    client.notify(internal_guild.logger.channel, valor)
            }
        })

        setTimeout(() => {
            usersmap.delete(id_alvo)
        }, 5000)
    }
}