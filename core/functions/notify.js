const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, data }) => {

    const { id_canal, conteudo, objeto } = data

    if (!id_canal) return

    const canal = await client.getGuildChannel(id_canal)
    if (!canal) return

    // Verificando se o bot possui permissões para enviar mensagens ou ver o canal
    if (!await client.execute("permissions", { id_user: client.id(), permissions: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], canal })) return

    if (objeto && objeto?.rotative.active) {

        // Enviando o conteúdo no canal informado e tentando editar a mensagem anterior
        canal.messages.fetch(client.decifer(objeto.rotative.mid))
            .then(message => { message.edit(conteudo) })
            .catch(async () => {

                const m = await canal.send(conteudo)

                // Salvando o ID da mensagem enviada como módulo
                await client.execute("updateModuleValue", { hash: objeto?.hash, chave: "rotative.mid", value: client.encrypt(m.id) })
            })
    } else
        canal.send(conteudo)
}