const { defaultEraser, defaultUserEraser } = require('../../../formatters/patterns/timeout')


module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1]) || dados
    let pagina_guia = 0, reback = "panel_guild_data"

    // Códigos de operação
    // 0 -> Redireciona para o painel de dados do servidor

    if (operacao === 1) pagina_guia = 1

    if (operacao === 2 || operacao === 3) {

        // Submenu para escolher o escopo do tempo de exclusão dos dados do servidor
        const valores = []
        const guild = await client.getGuild(interaction.guild.id)

        const lista_valores = operacao == 2 ? defaultEraser : defaultUserEraser
        const selecao_atual = operacao == 2 ? guild.erase.timeout : guild.iddle.timeout

        Object.keys(lista_valores).forEach(key => { if (parseInt(key) !== selecao_atual) valores.push(`${key}.${lista_valores[key]}`) })

        // Definindo o tempo mínimo para a exclusão de dados do servidor após saída, ou expulsão automática do bot por inatividade
        const data = {
            title: { tls: operacao == 2 ? "menu.menus.escolher_expiracao" : "menu.menus.escolher_inatividade" },
            pattern: "numbers",
            alvo: operacao == 2 ? "data_guild_timeout" : "data_guild_iddle",
            values: valores
        }

        let row = client.create_buttons([
            { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: reback }
        ], interaction)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row],
            flags: "Ephemeral"
        })
    }

    // Redirecionando o evento
    require('../../chunks/panel_guild_data')({ client, user, interaction, pagina_guia })
}