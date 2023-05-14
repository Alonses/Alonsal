const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { getBot } = require('../../adm/database/schemas/Bot')
const { timer_broadcast, checa_broadcast, encerra_brodcast } = require('../../adm/eventos/broadcast')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_broadcast")
        .setDescription("⌠🤖⌡ Enviar mensagem em canal especifico")
        .addSubcommand(subcommand =>
            subcommand.setName("configurar")
                .setDescription("⌠🤖⌡ Configurar um canal de broadcast")
                .addStringOption(option =>
                    option.setName("alvo")
                        .setDescription("ID do canal que será enviado as mensagens")
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName("local")
                        .setDescription("ID do canal que receberá as mensagens")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("update")
                .setDescription("⌠🤖⌡ (Des)ativar o broadcast"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (interaction.user.id !== client.owners[0]) return

        const bot = await getBot(client.id())

        if (interaction.options.getSubcommand() === "configurar") {

            await checa_broadcast(client, bot)

            if (client.decider(bot?.transmission.status, 0))
                return interaction.reply({ content: ":o: | Um broadcast está ativo no momento, não é possível ativar dois ao mesmo tempo!", ephemeral: true })

            // Configurando um canal para receber broadcast
            const id_broad = interaction.options.getString("alvo")
            const canal_alvo = await client.channels().get(id_broad)

            if (!canal_alvo) // Canal restrito
                return interaction.reply({ content: `:mag: | O canal mencionado não pode ser visto!\nPor favor, tente novamente com um outro ID`, ephemeral: true })

            if (canal_alvo.type !== 0 && canal_alvo.type !== 5) // Canal com tipo inválido
                return interaction.reply({ content: `:o: | O tipo do canal selecionado não pode receber mensagens de broadcast!\nPor favor, tente novamente com um outro ID`, ephemeral: true })

            bot.transmission.id_broad = id_broad
            bot.transmission.id_cast = interaction.options.getChannel("local").id
            bot.transmission.author = interaction.user.id

            bot.transmission.status = true

            timer_broadcast(client, bot)

            interaction.reply({ content: `:satellite: | O Broadcast entre canais está ativo, agora enviarei mensagens para o canal <#${bot.transmission.id_broad}>\nUse este canal para receber mensagens do canal definido e conversar com usuários remotamente!`, ephemeral: true })

        } else {

            // Ativando ou desativando o recurso de broadcast do bot
            if (typeof bot.transmission.status === "undefined") return

            bot.transmission.status = !bot.transmission.status

            if (bot.transmission.status) { // Reativando
                interaction.reply({ content: `:satellite: | O Broadcast entre canais está ativo novamente, agora enviarei mensagens para o canal <#${bot.transmission.id_cast}>\nUse este canal para receber mensagens do canal definido e conversar com usuários remotamente!`, ephemeral: true })
                timer_broadcast(client, bot)

                // Alterando o chat de broad conforme onde o comando foi acionado para ativar novamente
                bot.transmission.id_cast = interaction.channel.id
            } else { // Desligando
                interaction.reply({ content: `:zzz: | O Broadcast entre canais foi desligado.`, ephemeral: true })
                encerra_brodcast(client, bot, true)
            }
        }

        await bot.save()
    }
}