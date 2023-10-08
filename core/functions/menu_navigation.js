module.exports = (client, interaction, dados, alvo, pagina) => {

    let row, b_disabled = [false, false]
    b_disabled[pagina] = true

    // Verificando se a quantidade de elementos supera o permitido nos menus
    if (Math.ceil(dados.values.length / 25) > 1)
        row = client.create_buttons([
            { id: alvo, name: '◀️', type: 1, data: `0|navigation_button.${pagina}.${dados.alvo}`, disabled: b_disabled[0] },
            { id: alvo, name: '▶️', type: 1, data: `1|navigation_button.${pagina}.${dados.alvo}`, disabled: b_disabled[1] }
        ], interaction)

    return row
}