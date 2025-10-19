const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { AttachmentBuilder } = require('discord.js')

module.exports = async ({ client, alvo, interaction, user_command, internal_module }) => {

    fetch(`${process.env.url_apisal}/curiosidades`)
        .then(response => response.json())
        .then(async res => {

            let descricao_curio = res.texto

            if (res.data_curio) // Imagem da curiosidade
                if (res.data_curio.includes("youtu.be"))
                    descricao_curio = `${res.texto}\n${res.data_curio}`
                else {
                    if (!res.data_curio.includes("tenor.com")) { // Imagens em anexo
                        const file = new AttachmentBuilder(res.data_curio, `image.jpeg`)

                        if (interaction)
                            interaction.reply({
                                content: `〽️ | ${descricao_curio}`,
                                files: [file],
                                flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
                            })
                        else client.execute("sendModule", { alvo, dados: { content: `〽️ | ${descricao_curio}`, files: [file] }, internal_module })
                    } else // Gifs
                        if (interaction)
                            interaction.reply({
                                content: `〽️ | ${descricao_curio}\n${res.data_curio}`,
                                flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
                            })
                        else client.execute("sendModule", { alvo, dados: { content: `〽️ | ${descricao_curio}\n${res.data_curio}` }, internal_module })

                    return
                }

            if (interaction) // Enviando um texto normal sem arquivos anexados
                interaction.reply({
                    content: `〽️ | ${descricao_curio}`,
                    flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
                })
            else client.execute("sendModule", { alvo, dados: { content: `〽️ | ${descricao_curio}` }, internal_module })
        })
}