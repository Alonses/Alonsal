module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[2]

    dados = { id: id_alvo } // Redirecionando o evento
    require('../../chunks/panel_guild_browse_pre_warns.js')({ client, user, interaction, dados })
}