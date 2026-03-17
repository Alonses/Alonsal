const { PermissionsBitField } = require("discord.js")

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    const channel = dados.split(".")[2]
    const guild = dados.split(".")[3]

    // Verificando as permissões do membro que ativou o botão de exclusão no canal de denuncias
    if (!await client.execute("permissions", { interaction, id_user: interaction.user.id, permissions: [PermissionsBitField.Flags.ManageChannels] }))
        return client.tls.reply(interaction, user, "mode.denuncia.sem_permissao", true, 3)

    // 0 -> Botões de confirmação para excluir o canal de denúncia
    // 1 -> Confirma exclusão
    // 2 -> Cancela exclusão

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

    } else {

        // Retornando ao botão para poder solicitar exclusão do canal
        const row = client.create_buttons([
            { id: "complaints", name: { tls: "menu.botoes.excluir_canal" }, type: 3, emoji: client.emoji(13), data: `0|${channel}.${guild}` }
        ], interaction, user)

        client.reply(interaction, { components: [row] })
    }
}