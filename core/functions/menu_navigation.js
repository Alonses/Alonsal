module.exports = (dados, pagina) => {

    let row = [], b_disabled = [false, false]
    b_disabled[pagina] = true

    // Verificando se a quantidade de elementos supera o permitido nos menus
    if (Math.ceil(dados.values.length / 25) > 1)
        row = [
            { id: dados.reback?.split(".")[0] || dados.alvo, name: '◀️', type: 1, data: `0|${pagina}.${dados.operation}.${dados.reback?.split(".")[1] || dados.alvo}`, disabled: b_disabled[0] },
            { id: dados.reback?.split(".")[0] || dados.alvo, name: '▶️', type: 1, data: `1|${pagina}.${dados.operation}.${dados.reback?.split(".")[1] || dados.alvo}`, disabled: b_disabled[1] }
        ]

    return row
}