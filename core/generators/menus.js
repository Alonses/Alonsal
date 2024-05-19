const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

function create_menus({ client, interaction, user, data, pagina, multi_select, guild }) {

    if (data.values.length < 1) // Menu sem dados para listar
        return interaction.update({
            content: ":mag: | Não há dados para serem conferidos através dos menus no momento...\n\nCaso você esteja selecionado cargos, verifique se o servidor possui cargos customizados criados. Não é possível acessar menus para escolher cargos `@here` ou `@everyone`."
        })

    const itens_menu = [], alvo = data.alvo
    let insersoes = [], i = 0, indice_start = pagina * 24 || 0

    // Acrescenta um indice para evitar duplicatas
    if (pagina > 0) indice_start++

    // Percorrendo as entradas informadas
    for (let x = indice_start; x < data.values.length; x++) {

        const valor = data.values[x]

        // Montando a lista de valores para escolher conforme o alvo de entrada
        if (!insersoes.includes(valor)) {

            let { nome_label, emoji_label, descricao_label, valor_label } = require(`../formatters/menus/${data.pattern}`)({ client, user, alvo, valor })

            itens_menu.push({
                label: nome_label,
                emoji: emoji_label,
                description: descricao_label,
                value: valor_label
            })

            i++
            insersoes.push(valor)
        }

        if (x == (24 + indice_start)) break
    }

    // Definindo titulos e ID's exclusivos para diferentes comandos
    let titulo_menu = data.title.tls.split(".").length > 2 ? client.tls.phrase(user, data.title.tls) : data.title.tls
    let id_menu = `select_${alvo}_${interaction.user.id}`
    let min = 1, max = 1

    // Menu com multi-seleção
    if (multi_select) max = data.values.length - indice_start > 25 ? 25 : data.values.length - indice_start

    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(id_menu)
                .setPlaceholder(titulo_menu)
                .addOptions(itens_menu)
                .setMinValues(min)
                .setMaxValues(max)
        )

    return row
}

module.exports.create_menus = create_menus