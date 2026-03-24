const { PermissionsBitField } = require("discord.js")

const { getTicket, dropTicket } = require("../../../database/schemas/User_tickets")

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    let channel = dados.split(".")[2]
    let guild = dados.split(".")[3]

    // Verificando as permissões do membro que ativou o botão de exclusão no canal de denuncias
    if (!await client.execute("permissions", { interaction, id_user: interaction.user.id, permissions: [PermissionsBitField.Flags.ManageChannels] }) && operacao !== 3)
        return client.tls.reply(interaction, user, "mode.denuncia.sem_permissao", true, 3)

    // 0 -> Botões de confirmação para excluir o canal de denúncia (moderador)
    // 1 -> Confirma exclusão (moderador)
    // 2 -> Cancela exclusão (moderador)

    // 3 -> Menu para confirmar a criação de um canal de denúncias
    // 4 -> Confirma criação do canal de tickets
    // 5 -> Cancela a criação do canal de tickets

    // 6 -> Confirma a exclusão do canal de tickets (membro)
    // 7 -> Cancela a exclusão do canal de tickets (membro)

    if (operacao === 0) {

        // Criando os botões para o menu de advertências
        const row = client.create_buttons([
            { id: "complaints", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `1|${channel}.${guild}` },
            { id: "complaints", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `2|${channel}.${guild}` }
        ], interaction, user)

        client.reply(interaction, {
            components: [row],
            flags: "Ephemeral"
        })

    } else if (operacao === 1) {

        // Excluindo o canal de denuncias
        const guild_channel = await client.getGuildChannel(channel)

        // Notificando sobre a exclusão do canal no chat de mensagens
        client.reply(interaction, {
            content: client.tls.phrase(user, "mode.voice_channels.aviso_exclusao", 13, Math.floor((new Date().getTime() + 10000) / 1000)),
            components: []
        })

        setTimeout(() => {
            guild_channel.delete()
        }, 10000)

    } else if (operacao === 2) {

        // Retornando ao botão para poder solicitar exclusão do canal
        const row = client.create_buttons([
            { id: "complaints", name: { tls: "manu.guild_data.remover_canal" }, type: 3, emoji: client.emoji(13), data: `0|${channel}.${guild}` }
        ], interaction, user)

        client.reply(interaction, { components: [row] })

    } else if (operacao === 3) {

        const row = client.create_buttons([
            { id: "complaints", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `4|0.0` },
            { id: "complaints", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `5|0.0` }
        ], interaction, user)

        return interaction.reply({
            content: client.tls.phrase(user, "mode.denuncia.confirma_canal", 8),
            components: [row],
            flags: "Ephemeral"
        })

    } else if (operacao === 4) {

        // Confirmado a criação de um canal de denuncia
        channel = await getTicket(client.encrypt(interaction.guild.id), client.encrypt(interaction.user.id))

        // Buscando os dados do canal no servidor
        const canal_servidor = interaction.guild.channels.cache.find(c => c.id === client.decifer(channel.cid))

        return require("../../../generators/channels/tickets")({ client, user, interaction, channel, canal_servidor })

    } else if (operacao === 5 || operacao === 7) {

        return interaction.update({
            content: client.tls.phrase(user, "menu.botoes.operacao_cancelada", 11),
            components: [],
            flags: "Ephemeral"
        })

    } else if (operacao === 6) {

        interaction.update({
            content: client.tls.phrase(user, "mode.denuncia.fechando_canal", 7, `<t:${Math.floor((new Date().getTime() + 10000) / 1000)}:R>`),
            components: [],
            flags: "Ephemeral"
        })

        guild = await client.getGuild(interaction.guild.id)
        channel = await getTicket(client.encrypt(interaction.guild.id), client.encrypt(interaction.user.id))

        // Apagando o ticket de denúncia do usuário
        dropTicket(client.encrypt(interaction.guild.id), client.encrypt(interaction.user.id))

        // Buscando os dados do canal no servidor
        const canal_servidor = interaction.guild.channels.cache.find(c => c.id === client.decifer(channel.cid))

        setTimeout(() => {
            canal_servidor.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false })
                .then(() => {
                    setTimeout(() => {
                        const row = client.create_buttons([{ id: "complaints", name: { tls: "manu.guild_data.remover_canal" }, type: 3, emoji: client.emoji(13), data: `0|${canal_servidor.id}.${interaction.guild.id}` }], interaction, user)

                        // Notificando no canal para os moderadores
                        client.execute("notify", { id_canal: canal_servidor.id, conteudo: { content: client.tls.phrase(guild, "mode.denuncia.canal_encerrado", 76, [interaction.user.username, interaction.user.id, interaction.user.id, client.execute("timestamp")]), components: [row] } })
                    }, 2000)
                })
        }, 10000)
    }
}