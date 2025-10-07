/**
 * Define quais botões de navegação do ranking devem ser desabilitados
 * @param {object} params
 * @param {number} params.pagina - Página atual
 * @param {number} params.paginas - Total de páginas
 * @param {Array} params.ids - IDs relevantes para navegação
 * @param {object} params.interaction - Objeto de interação do usuário
 * @returns {Array<boolean>} Array indicando botões desabilitados
 */
module.exports = ({ pagina, paginas, ids, interaction }) => {

    // Ordem dos botões: [primeiro, anterior, usuário, próximo, último]
    const b_disabled = [false, false, false, false, false]

    // Primeira página: desabilita 'primeiro' e 'anterior'
    if (pagina <= 1) {
        b_disabled[0] = true
        b_disabled[1] = true
    }

    // Segunda página: desabilita 'primeiro'
    if (pagina === 2)
        b_disabled[0] = true

    // Última página: desabilita 'próximo' e 'último'
    if (pagina === paginas) {
        b_disabled[3] = true
        b_disabled[4] = true
    }

    // Penúltima página: desabilita 'último'
    if (pagina === paginas - 1)
        b_disabled[4] = true

    // Página do usuário: desabilita botão do usuário
    if (ids.includes(interaction.user.id))
        b_disabled[2] = true

    return b_disabled
}