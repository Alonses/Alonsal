const { defaultUserEraser } = require('../../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1]) || 0
    let pagina_guia = 0, reback = "panel_personal_data"

    // Códigos de operação
    // 0 -> Redireciona para o painel de dados do usuário

    if (operacao === 1)
        pagina_guia = 1

    if (operacao === 5) {

        reback = "panel_personal_data.1"

        let row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "data_user_button", name: client.tls.phrase(user, "menu.botoes.globalmente"), type: 1, emoji: client.defaultEmoji("earth"), data: "2" },
            { id: "data_user_button", name: client.tls.phrase(user, "menu.botoes.por_servidor"), type: 1, emoji: client.emoji(5), data: "3" }
        ], interaction)

        return interaction.update({
            components: [row],
            flags: "Ephemeral"
        })
    } else if (operacao > 1) {

        // Submenu para escolher o escopo do tempo de exclusão dos dados do usuário
        const valores = []
        let escopo = "global", indice_erase = user.erase.timeout
        reback = "panel_personal_data.1"

        if (operacao === 3) {
            escopo = "guild"
            indice_erase = user.erase.guild_timeout
        }

        Object.keys(defaultUserEraser).forEach(key => { if (parseInt(key) !== indice_erase) valores.push(`${key}.${defaultUserEraser[key]}`) })

        // Definindo o tempo mínimo que um usuário deverá ficar mutado no servidor
        const data = {
            title: { tls: "menu.menus.escolher_inatividade" },
            pattern: "numbers",
            alvo: `data_user_${escopo}_timeout`,
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback
        }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row],
            flags: "Ephemeral"
        })
    }

    // Redirecionando o evento
    require('../../chunks/panel_personal_data')({ client, user, interaction, pagina_guia })
}