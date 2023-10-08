const { timer_broadcast, encerra_broadcast } = require('../../../core/events/broadcast')

module.exports = async ({ client, interaction, bot }) => {

    // Ativando ou desativando o recurso de broadcast do bot
    if (typeof bot.transmission.status === "undefined") return

    const canal_alvo = await client.channels().get(bot.transmission.id_broad)
    const guild = await client.getGuild(canal_alvo.guild.id)

    if (!client.decider(guild.conf?.broadcast, 0))
        return interaction.reply({
            content: ":o: | O broadcast para o servidor que possui este ID está desabilitado.",
            ephemeral: true
        })

    bot.transmission.status = !bot.transmission.status
    client.cached.broad_status = bot.transmission.status

    if (bot.transmission.status) { // Reativando
        interaction.reply({
            content: `:satellite: | O Broadcast entre canais está ativo novamente, agora enviarei mensagens para o canal <#${bot.transmission.id_cast}>\nUse este canal para receber mensagens do canal definido e conversar com usuários remotamente!`,
            ephemeral: true
        })

        timer_broadcast(client, bot)
        client.notify(bot.transmission.id_broad, { content: ":satellite: :satellite: :satellite:" })

        // Alterando o chat de broad conforme onde o comando foi acionado para ativar novamente
        bot.transmission.id_cast = interaction.channel.id
    } else { // Desligando
        interaction.reply({
            content: ":zzz: | O Broadcast entre canais foi desligado.",
            ephemeral: true
        })
        encerra_broadcast(client, bot, true)
    }

    await bot.save()
}