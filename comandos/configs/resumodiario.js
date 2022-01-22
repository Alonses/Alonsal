const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "resumodiario",
    description: "Veja um resumo diário de forma manual",
    aliases: [ "rsd" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message) {

        if (!client.owners.includes(message.author.id)) return;

        const bot = {
            comandos_disparados: 0,
            exp_concedido: 0,
            msgs_lidas: 0,
            epic_embed_fails: 0
        };

        const { comandos_disparados, exp_concedido, msgs_lidas, epic_embed_fails} = require(`../../arquivos/data/relatorio.json`);
        bot.comandos_disparados = comandos_disparados;
        bot.exp_concedido = exp_concedido;
        bot.msgs_lidas = msgs_lidas;
        bot.epic_embed_fails = epic_embed_fails;

        let canais_texto = client.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
        let canais_voz = client.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
        let members = 0;

        client.guilds.cache.forEach(async guild => {
            members += guild.memberCount - 1;
        });

        let embed = new MessageEmbed()
        .setTitle("Resumo diário :mega:")
        .setColor(0x29BB8E)
        .addFields(
            {
                name: ":gear: **Comandos**",
                value: `**Hoje:** \`${bot.comandos_disparados}\``,
                inline: true
            },
            {
                name: ":medal: **Experiência**",
                value: `**Hoje:** \`${bot.exp_concedido}\``,
                inline: true
            },
            {
                name: ":e_mail: **Mensagens**",
                value: `**Hoje:** \`${bot.msgs_lidas}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: ':globe_with_meridians: **Servidores**',
                value: `**Ativo em:** \`${client.guilds.cache.size}\``,
                inline: true
            },
            {
                name: ':card_box: **Canais**',
                value: `**Observando:** \`${canais_texto}\`\n**Falando em:** \`${canais_voz}\``,
                inline: true
            },
            {
                name: ':busts_in_silhouette: **Usuários**',
                value: `**Escutando:** \`${members}\``,
                inline: true
            }
        );
        
        message.reply({ embeds: [embed] });
    }
};