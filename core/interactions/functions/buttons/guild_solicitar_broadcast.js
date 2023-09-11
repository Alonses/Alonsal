const { EmbedBuilder } = require('discord.js')

const { timer_broadcast } = require('../../../events/broadcast')

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    const guild = await client.getGuild(interaction.guild.id)

    // Tratamento dos cliques
    // 1 -> Solicitar Broadcast
    // 2 -> (Des)Ativa o Broadcast no servidor
    // 3 -> Usado pelo Slondo, altera a "frequência" do canal para o solicitado

    if (escolha === 1) {

        const broadcast = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "mode.broadcast.nova_solicitacao")} :globe_with_meridians:`)
            .setColor(0xffffff)
            .setDescription("Uma nova solicitação de broadcast foi aberta")
            .setFields(
                {
                    name: `**${client.defaultEmoji("person")} Solicitante**`,
                    value: `${client.emoji("icon_id")} \`${interaction.user.id}\`\n( <@${interaction.user.id}> )`,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("paper")} Canal**`,
                    value: `${client.emoji("icon_id")} \`${interaction.channel.id}\`\n<#${interaction.channel.id}>`,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({
                text: `Autor: ${interaction.user.username}`,
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        const row = client.create_buttons([
            { id: "guild_solicitar_broadcast", name: "Alterar canal", type: 1, emoji: "📡", data: `3|${interaction.channel.id}` }
        ], interaction)

        await client.notify(process.env.channel_mail, { embed: broadcast, components: row })
        interaction.update({
            content: `${client.emoji("emojis_dancantes")} | ${client.tls.phrase(user, "mode.broadcast.pedido_registrado")}`,
            embeds: [],
            components: [],
            ephemeral: true
        })

    } else if (escolha === 2) {

        // Ativa ou desativa a possibilidade do Alonsal realizar Broadcasting nos chats do servidor
        if (typeof guild.conf.broadcast !== "undefined")
            guild.conf.broadcast = !guild.conf.broadcast
        else
            guild.conf.broadcast = true

        await guild.save()

        if (guild.conf.broadcast)
            interaction.update({
                content: client.tls.phrase(user, "mode.broadcast.ativado_button", 10),
                embeds: [],
                components: [],
                ephemeral: true
            })
        else
            interaction.update({
                content: client.tls.phrase(user, "mode.broadcast.desativado_button", client.emoji(0)),
                embeds: [],
                components: [],
                ephemeral: true
            })

    } else {

        const bot = await client.getBot()
        const id_broadcast = dados.split(".")[2]

        // Verificando se a Função de Broadcast não foi desativada após a solicitação
        const canal_alvo = await client.channels().get(id_broadcast)
        const guild = await client.getGuild(canal_alvo.guild.id)

        if (!client.decider(guild.conf?.broadcast, 0)) // Servidor com broadcast desativado
            return interaction.update({
                content: ":o: | O broadcast para o servidor que possui este ID está desabilitado.",
                components: []
            })

        // Alterando o ID do canal de broadcast para o novo solicitante
        bot.transmission.id_broad = id_broadcast
        client.cached.broad_status = true
        bot.transmission.status = true
        await bot.save()

        // Iniciando o Broadcast
        timer_broadcast(client, bot)

        client.notify(bot.transmission.id_broad, ":satellite: :satellite: :satellite:")
        client.notify(bot.transmission.id_cast, `:satellite: | O Broadcast entre canais está ativo, agora enviarei mensagens para o canal <#${bot.transmission.id_broad}>\nUse este canal para receber mensagens do canal definido e conversar com outros usuários remotamente!`)

        interaction.update({
            content: `:satellite: | Canal alterado para ( \`${id_broadcast}\` | <#${id_broadcast}> )\nUse o canal <#${bot.transmission.id_cast}> para visualizar e enviar mensagens.`,
            components: []
        })
    }
}