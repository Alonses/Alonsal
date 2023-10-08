module.exports = (client, interaction, elementos, alvo, pagina) => {

    let row, b_disabled = [false, false]
    b_disabled[pagina] = true

    // Verificando se a quantidade de elementos supera o permitido nos menus
    if (Math.ceil(elementos.length / 25) > 1)
        row = client.create_buttons([
            { id: alvo, name: '◀️', type: 1, data: `0|${pagina}.${alvo}`, disabled: b_disabled[0] },
            { id: alvo, name: '▶️', type: 1, data: `1|${pagina}.${alvo}`, disabled: b_disabled[1] }
        ], interaction)

    return row
}