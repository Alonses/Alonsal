/**
 * Manipula e notifica erros críticos do sistema
 * @param {object} client - Instância do client
 * @param {Error} err - Objeto de erro
 * @param {string} local - Local/contexto do erro
 */
module.exports = (client, err, local) => {

    // Garante que err seja um objeto Error
    const errorObj = err instanceof Error ? err : new Error(String(err))

    // Cria embed detalhado do erro
    const embed = client.create_embed({
        title: `> CeiraException | ${local}`,
        color: "vermelho",
        description: `\`\`\`🛑 ${errorObj.name} - ${errorObj.message}\n\n📑 Local: ${errorObj.stack}\`\`\``
    })

    // Loga erro no console para depuração
    console.error(errorObj)

    // Notifica canal de erro, se definido
    if (process.env.channel_error)
        client.notify(process.env.channel_error, { embeds: [embed] })

    // Registra no journal do sistema
    client.journal("epic_embed", 1)
}