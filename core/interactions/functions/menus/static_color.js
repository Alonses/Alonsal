module.exports = async ({ client, user, interaction, dados }) => {

    const valor = dados // Redirecionando o evento
    require("../../chunks/static_color")({ client, user, interaction, valor })
}