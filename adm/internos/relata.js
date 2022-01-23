const { MessageEmbed } = require('discord.js');

module.exports = async ({client}) => {

    if(client.user.id !== "833349943539531806") return;

    const date1 = new Date(); // Ficará esperando até meia noite para executar a rotina
    const tempo_restante =  ((24 - date1.getHours()) *3600000) + ((60 - date1.getMinutes()) *60000) + ((60 - date1.getSeconds()) *1000);
    
    gera_relatorio(client, tempo_restante);

    setTimeout(() => {
        gera_relatorio(client, 86400000);
        requisita_relatorio(client, 86400000); // Altera o valor para sempre executar à meia-noite
    }, tempo_restante); // Executa de 1 em 1 dia
}

function requisita_relatorio(client, aguardar_tempo){
    setTimeout(() => {
        gera_relatorio(client, aguardar_tempo);
        requisita_relatorio(client, aguardar_tempo);
    }, aguardar_tempo);
}

async function gera_relatorio(client, proxima_att){

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        epic_embed_fails: 0
    };
    
    const A = proxima_att;
    const segundos = parseInt((A / 1000) % 60);
    const minutos = parseInt((A / (1000 * 60)) % 60);
    const horas = parseInt((A / (1000 * 60 * 60)) % 24);
    proxima_att = `${("0"+ (horas)).substr(-2)}:${("0"+ (minutos)).substr(-2)}:${("0"+ (segundos)).substr(-2)}`;
    proxima_att = proxima_att == "00:00:00" ? "24:00:00" : proxima_att;
    
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
    )
    .setFooter(`Próxima atualização em ${proxima_att}`);
    
    await client.channels.cache.get('934426266726174730').send({ embeds: [embed] });
    require("../funcoes/resrelatorio.js")({}); // Reseta o relatório
}