const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client, user, interaction }) => {

    fetch(`${process.env.url_apisal}/status`)
        .then(res => res.json())
        .then(retorno => {

            let text = "Processamento atual\n", used = retorno.process
            let texto_apisal = "🛑 | A Apisal se encontra Offline"

            if (retorno.status)
                texto_apisal = "✅ | A Apisal se encontra Online"

            for (let key in used)
                text += `${key}: ${used[key]} MB\n`

            const row = client.create_buttons([
                { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" }
            ], interaction)

            interaction.update({
                content: `\`\`\`${texto_apisal}\n\n${text}\`\`\``,
                embeds: [],
                components: [row],
                ephemeral: true
            })
        })
}