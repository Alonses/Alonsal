module.exports = async (client, dados) => {

    const guild = await client.getGuild(dados[0].guild.id)

    // Verificando se a guild habilitou o logger
    if (!client.decider(guild.conf?.logger, 0) || !client.x.logger) return

    // Alterando os cargos do usuário
    if (dados[0]._roles !== dados[1]._roles)
        return require('./endpoints/member_role')(client, guild, dados)
}