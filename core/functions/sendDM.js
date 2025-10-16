
module.exports = async ({ client, data }) => {

    // Envia uma notificação em DM para o usuário
    let user = data.user
    let dados = data.dados || ''
    let force = data.force || false
    let internal_module = data.internal_module || null

    // Descriptografando o ID do usuário para envio em DM
    const id_user = (user.uid).length > 20 ? client.decifer(user.uid) : user.uid

    // Previne que o bot envie DM's para si mesmo
    if (id_user === client.id()) return
    if (force) user.conf.notify = 1

    // Notificando o usuário alvo caso ele receba notificações em DM do bot
    if (client.decider(user?.conf?.notify, 1)) {

        const user_interno = await client.discord.users.fetch(id_user)
            .catch(() => { return null })

        if (user_interno) {
            if (internal_module?.rotative?.mid) {

                const channel = await user_interno.createDM()
                channel.messages.fetch(client.decifer(internal_module.rotative.mid))
                    .then(message => {
                        message.edit(dados)
                            .catch(async () => {
                                await user_interno.send(dados) // Enviando conteúdo na DM do usuário
                                    .then(async m => {

                                        // Salvando o ID da mensagem enviada como módulo
                                        await client.execute("updateModuleValue", { hash: internal_module?.hash, chave: "rotative.mid", value: client.encrypt(m.id) })
                                    })
                                    .catch()
                            })
                    })
            } else
                await user_interno.send(dados) // Enviando conteúdo na DM do usuário
                    .then(async m => {
                        // Salvando o ID da mensagem enviada como módulo
                        await client.execute("updateModuleValue", { hash: internal_module?.hash, chave: "rotative.mid", value: client.encrypt(m.id) })
                    })
                    .catch()
        }
    }
}