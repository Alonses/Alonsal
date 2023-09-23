const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { activities } = require('../../files/json/text/activities.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("information")
        .setNameLocalizations({
            "es-ES": 'informacion',
            "it": 'informazione',
            "pt-BR": 'informacoes',
            "ru": 'информация'
        })
        .setDescription("⌠📡⌡ Alonsal information")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Alonsal-Informationen',
            "es-ES": '⌠📡⌡ Información Alonsal',
            "fr": '⌠📡⌡ Informations sur le Alonsal',
            "it": '⌠📡⌡ Informazioni Alonsal',
            "pt-BR": '⌠📡⌡ Informações do Alonsal',
            "ru": '⌠📡⌡ Информация от Алонсал'
        }),
    async execute(client, user, interaction) {

        const bot = await client.getBot()
        let row = [], ouvindo_agora = ""

        if (activities[client.cached.presence].link) {
            ouvindo_agora = `\`\`\`fix\n🎶 ${client.tls.phrase(user, "manu.info.ouvindo_agora")}\n${client.defaultEmoji("instrument")} ${activities[client.cached.presence].text}\`\`\`\n\n`

            row = client.create_buttons([
                { name: client.tls.phrase(user, "menu.botoes.ouvir_tambem"), emoji: client.defaultEmoji("music"), value: activities[client.cached.presence].link, type: 4 }
            ], interaction)
        }

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "manu.info.infos"))
            .setColor(client.embed_color(user.misc.color))
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(`${ouvindo_agora}${client.tls.phrase(user, "manu.info.conteudo_1")}\n${client.emoji("dancando_elizabeth")} ${client.tls.phrase(user, "manu.info.conteudo_2")}\n${client.emoji("mc_bolo")} ${client.tls.phrase(user, "manu.info.conteudo_3")}\n\n${client.tls.phrase(user, "manu.info.invocado_1")} \`${client.locale(bot.persis.commands + 1)}\` ${client.tls.phrase(user, "manu.info.invocado_2")} ${client.emoji("emojis_dancantes")}\n[ _${client.tls.phrase(user, "manu.info.versao")} ${bot.persis.version}_ ]\n\n${client.tls.phrase(user, "manu.info.spawn_alonsal")} <t:1618756500>`)
            .setFooter({
                text: "Alonsal",
                iconURL: "https://i.imgur.com/K61ShGX.png"
            })

        if (row.length < 1)
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        else
            interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            })
    }
}