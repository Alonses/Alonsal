module.exports = ({ pagina, paginas, ids, interaction }) => {

    // (Des)abilita os botões de navegação nos Embeds de rank
    const b_disabled = [false, false, false, false, false]

    if (pagina < 2) { // Primeira página
        b_disabled[0] = true
        b_disabled[1] = true
    }

    if (pagina < 3) // Segunda página
        b_disabled[0] = true

    if (pagina === paginas) { // Última página
        b_disabled[3] = true
        b_disabled[4] = true
    }

    if (pagina === paginas - 1) // Penúltima página
        b_disabled[4] = true

    if (ids.includes(interaction.user.id)) // Página com o usuário
        b_disabled[2] = true

    return b_disabled
}