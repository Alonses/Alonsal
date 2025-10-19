const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, data }) => {

    // Apaga os convites criados pelo usuário que foi expulso/banido do servidor
    // Canal para envio da notificação dos convites rastreados
    const { guild, id_user } = data
    const canal_notifica = guild.nuke_invites.channel ? guild.nuke_invites.channel : guild.logger.channel

    // Notificando sobre a falta de permissões e desligando o recurso no servidor
    if (!await client.execute("permissions", { interaction: guild.sid, id_user: client.id(), permissions: [PermissionsBitField.Flags.ManageGuild] })) {

        guild.conf.nuke_invites = false
        guild.save()

        return client.execute("notify", {
            id_canal: canal_notifica,
            conteudo: { content: client.tls.phrase(guild, "mode.invites.sem_permissao_2", 7) }
        })
    }

    // Excluindo os convites que o membro expulso/banido criou
    const cached_guild = await client.guilds(guild.sid)
    cached_guild.invites.fetch().then(invites => {

        let convites = 0

        invites.each(i => {
            if (i.inviterId === id_user) {
                i.delete()
                convites++
            }
        })

        if (convites > 0) { // Enviando a notificação de convites rastreados excluídos
            const convites_formatado = `${convites} ${convites > 1 ? client.tls.phrase(guild, "mode.invites.convites") : client.tls.phrase(guild, "mode.invites.convite")}`
            client.execute("notify", { id_canal: canal_notifica, conteudo: { content: client.tls.phrase(guild, "mode.invites.exclusao", 44, convites_formatado) } })
        }
    })
}