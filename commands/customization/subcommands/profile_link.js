module.exports = async ({ client, user, interaction }) => {

    // Redirecionando para a opção respectiva
    require(`./endpoints/link_${interaction.options.getString("platform")}`)({ client, user, interaction })
}