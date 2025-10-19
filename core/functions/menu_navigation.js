/**
 * Gera os botões de navegação para menus paginados
 * @param {object} client - Instância do client
 * @param {object} data - Dados do menu
 * @returns {Array} Array de botões para navegação
 */
module.exports = ({ client, data }) => {

    const user = data.user
    const dados = data.data
    const pagina = data?.pagina || 0

    const itensPorPagina = 25

    const totalPaginas = Math.ceil((dados.values).length / itensPorPagina)
    const row = []

    // Desabilita os botões conforme a página atual
    const b_disabled = [
        pagina === 0, // Botão anterior desativado na primeira página
        (pagina + 1) === totalPaginas // Botão próximo desativado na última página
    ]

    // Só gera os botões de navegação se houver mais de uma página
    if (totalPaginas > 1) {

        const alvoPrincipal = dados.reback?.split(".")[0] || dados.alvo
        const alvoSecundario = dados.reback?.split(".")[1] || dados.alvo
        const submenu = dados.submenu ? `.${dados.submenu}` : ""

        row.push(
            {
                id: alvoPrincipal,
                name: '◀',
                type: 1,
                data: `0|${pagina}.${dados.operation}.${alvoSecundario}${submenu}`,
                disabled: b_disabled[0]
            },
            {
                id: alvoPrincipal,
                name: '▶',
                type: 1,
                data: `1|${pagina}.${dados.operation}.${alvoSecundario}${submenu}`,
                disabled: b_disabled[1]
            },
            {
                id: "indica_pag",
                name: `${client.tls.phrase(user, "menu.botoes.pagina")} ${pagina + 1} / ${totalPaginas}`,
                type: 2,
                disabled: true
            }
        )
    }

    return row
}