const { timer_broadcast, checa_broadcast } = require('../../../adm/eventos/broadcast')

module.exports = async ({ client, interaction, bot }) => {

    // Verificando se há broadcasts inválidos registrados
    await checa_broadcast(client, bot)

    if (client.decider(bot?.transmission.status, 0))
        return interaction.reply({ content: ":o: | Um broadcast está ativo no momento, não é possível ativar dois ao mesmo tempo!", ephemeral: true })

    // Configurando um canal para receber broadcast
    const id_broad = interaction.options.getString("alvo")
    const canal_alvo = await client.channels().get(id_broad)

    const guild = await client.getGuild(canal_alvo.guild.id)

    if (!client.decider(guild.conf?.broadcast, 0)) // Servidor com broadcast desativado
        return interaction.reply({ content: ":o: | O broadcast para o servidor que possui este ID está desabilitado.", ephemeral: true })

    if (!canal_alvo) // Canal restrito
        return interaction.reply({ content: `:mag: | O canal mencionado não pode ser visto!\nPor favor, tente novamente com um outro ID`, ephemeral: true })

    if (canal_alvo.type !== 0 && canal_alvo.type !== 5) // Canal com tipo inválido
        return interaction.reply({ content: `:o: | O tipo do canal selecionado não pode receber mensagens de broadcast!\nPor favor, tente novamente com um outro ID`, ephemeral: true })

    bot.transmission.id_broad = id_broad
    bot.transmission.id_cast = interaction.options.getChannel("local").id
    bot.transmission.author = interaction.user.id

    bot.transmission.status = true

    timer_broadcast(client, bot)

    interaction.reply({ content: `:satellite: | O Broadcast entre canais está ativo, agora enviarei mensagens para o canal <#${bot.transmission.id_broad}>\nUse este canal para receber mensagens do canal definido e conversar com outros usuários remotamente!`, ephemeral: true })

    await bot.save()
}