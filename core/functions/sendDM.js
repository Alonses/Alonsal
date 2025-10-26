
module.exports = async ({ client, data }) => {

    // Envia uma notificação em DM para o usuário
    let { user, dados, force, internal_module } = data

    // Sem dados para enviar ao usuário
    if (!dados) return

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
                                    .catch(err => { console.error(err) })
                                    .then(async m => {

                                        // Salvando o ID da mensagem enviada como módulo
                                        await client.execute("updateModuleValue", { hash: internal_module.hash, chave: "rotative.mid", value: client.encrypt(m.id) })
                                    })
                            })
                    })
            } else
                await user_interno.send(dados) // Enviando conteúdo na DM do usuário
                    .catch(err => { console.error(err) })
                    .then(async m => {

                        if (internal_module) // Salvando o ID da mensagem enviada como módulo
                            await client.execute("updateModuleValue", { hash: internal_module.hash, chave: "rotative.mid", value: client.encrypt(m.id) })
                    })
        }
    }
}