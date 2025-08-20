const { dataComboRelation } = require("../../../formatters/patterns/user")

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = `${dados.split(".")[1]}.${dados.split(".")[2]}`
    const escolha_user = client.tls.phrase(user, `manu.data.selects.${escolha}`), dados_para_exclusao = await lista_alteracoes(client, user, escolha)

    const embed = client.create_embed({
        title: { tls: "manu.data.exclusao_dados" },
        description: { tls: "manu.data.descricao_embed", emoji: 2, replace: [escolha_user, dados_para_exclusao] },
        footer: {
            text: { tls: "manu.data.rodape" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    const row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: `data.${escolha}` },
        { id: "data_confirm_button", name: { tls: "menu.botoes.confirmar" }, type: 2, emoji: client.emoji(10), data: `1.${escolha}` },
        { id: "data_confirm_button", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: '0' }
    ], interaction, user)

    interaction.update({
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
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
            const alvos = dataComboRelation[x]

            for (let z = 0; z < alvos.length; z++)
                phrase += `${await client.tls.phrase(user, `manu.data.causes.${alvos[z]}`)}\n\n`

            x--
        }
    }

    return phrase
}