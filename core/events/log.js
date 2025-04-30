module.exports = async ({ client, interaction }) => {

    if (client.x.relatorio) {
        await client.updateBot({
            commands: {
                increment: 1
            }
        })
    }

    client.registryExperience(interaction, "comando")
}