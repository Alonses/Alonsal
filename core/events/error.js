module.exports = (client, err, local) => {

    const embed = client.create_embed({
        title: `> CeiraException | ${local}`,
        color: "vermelho",
        description: `\`\`\`🛑 ${err.name} - ${err.message}\n\n📑 Local: ${err.stack}\`\`\``
    })

    console.log(err)

    client.notify(process.env.channel_error, { embeds: [embed] })
    client.journal("epic_embed")
}