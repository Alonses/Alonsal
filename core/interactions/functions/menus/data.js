const { EmbedBuilder } = require("discord.js")

const { combo_relation } = require("../../../data/update_data")

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = `${dados.split(".")[1]}.${dados.split(".")[2]}`
    const escolha_user = client.tls.phrase(user, `manu.data.selects.${escolha}`), dados_para_exclusao = await lista_alteracoes(client, user, escolha)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "manu.data.exclusao_dados"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.replace(client.tls.phrase(user, "manu.data.descricao_embed", 2), [escolha_user, dados_para_exclusao]))
        .setFooter({
            text: client.tls.phrase(user, "manu.data.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    const row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `data.${escolha}` },
        { id: "data_confirm_button", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1.${escolha}` },
        { id: "data_confirm_button", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: '0' }
    ], interaction)

    interaction.update({
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}

lista_alteracoes = async (client, user, escolha_user) => {

    let phrase = ""

    if (escolha_user.includes("uni"))
        phrase = client.tls.phrase(user, `manu.data.causes.${escolha_user.split(".")[1]}`)
    else {

        // Listando todas as alterações que serão feitas
        let x = parseInt(escolha_user.split(".")[1])

        while (x > 0) {
            const alvos = combo_relation[x]

            for (let z = 0; z < alvos.length; z++)
                phrase += `${await client.tls.phrase(user, `manu.data.causes.${alvos[z]}`)}\n\n`

            x--
        }
    }

    return phrase
}