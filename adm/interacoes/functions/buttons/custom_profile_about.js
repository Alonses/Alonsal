module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Remover o campo "Sobre mim" do perfil
    // 1 -> Menu com opções para customizar

    if (operacao === 0) {
        user.profile.about = null

        await user.save()

        // Retornando a função inicial para atualizar o embed do perfil
        return require('../../../../comandos/miscelania/subcommands/profile_panel')({ client, user, interaction })
    }

    const data = {
        title: "Navegando entre customizações",
        alvo: "profile_custom_navegar",
        values: ["1", "2", "3", "4", "5", "6"]
    }

    const menu = client.create_menus(client, interaction, user, data)

    return interaction.update({ content: ":mag: | Escolha uma das opções abaixo para customizar seu perfil", components: [menu], ephemeral: true })
}