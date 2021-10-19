const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');
 
module.exports = {
    name: "serverinfo",
    description: "Veja detalhes do servidor",
    aliases: [ "svinfo" ],
    cooldown: 1,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const getDateDiff = require('../../adm/diffdatas.js');

        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        const idioma_selecionado = idioma_servers[message.guild.id];

        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        let boost_sv = emoji(emojis.boost);
        let emoji_dancando = emoji(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]);
        let figurinhas = emoji(emojis.bigchad);

        const guild = message.guild;

        let dono_sv = guild.ownerId;
        dono_membro = await guild.members.fetch(dono_sv);
        dono_sv = "`"+ dono_membro.user.username + "#"+ dono_membro.user.discriminator +"`\n`"+ dono_sv +"`";

        let icone_server = guild.iconURL({ size: 2048 });

        let canais_texto = guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
        let canais_voz = guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
        let categorias = guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size;
        let qtd_canais = canais_texto + canais_voz;
        
        let qtd_membros = guild.memberCount; 
        const data_atual = new Date();

        let data_entrada = new Date(guild.joinedTimestamp); // Entrada do bot no server
        let diferenca_entrada = getDateDiff(data_entrada, data_atual, utilitarios);

        if(idioma_selecionado == "pt-br")
            data_entrada = data_entrada.getDate() +" de "+ data_entrada.toLocaleString('pt', { month: 'long' }) +" de "+ data_entrada.getFullYear() +" às "+ ("0"+ data_entrada.getHours()).substr(-2) +":"+ ("0"+ data_entrada.getMinutes()).substr(-2);
        else
            data_entrada = data_entrada.toLocaleString('en', { month: 'long' }) +" "+ data_entrada.getDate() +", "+ data_entrada.getFullYear() +" at "+ ("0"+ data_entrada.getHours()).substr(-2) +":"+ ("0"+ data_entrada.getMinutes()).substr(-2);

        let data_criacao = new Date(guild.createdAt); // Criação do servidor
        let diferenca_criacao = getDateDiff(data_criacao, data_atual, utilitarios);

        if(idioma_selecionado == "pt-br")
            data_criacao = data_criacao.getDate() +" de "+ data_criacao.toLocaleString('pt', { month: 'long' }) +" de "+ data_criacao.getFullYear() +" às "+ ("0"+ data_criacao.getHours()).substr(-2) +":"+ ("0"+ data_criacao.getMinutes()).substr(-2);
        else
            data_criacao = data_criacao.toLocaleString('en', { month: 'long' }) +" "+ data_criacao.getDate() +", "+ data_criacao.getFullYear() +" at "+ ("0"+ data_criacao.getHours()).substr(-2) +":"+ ("0"+ data_criacao.getMinutes()).substr(-2);

        if(icone_server !== null){
            icone_server = icone_server.replace(".webp", ".gif");

            await fetch(icone_server)
            .then(res => {
                if(res.status !== 200)
                    icone_server = icone_server.replace('.gif', '.webp')
            });
        }else
            icone_server = "";

        diferenca_entrada = diferenca_entrada.slice(0, -1);
        diferenca_criacao = diferenca_criacao.slice(0, -1);

        let infos_sv = new MessageEmbed()
        .setTitle(guild.name)
        .setColor(0x29BB8E)
        .setThumbnail(icone_server)
        .addFields(
            { name: ':globe_with_meridians: **'+ utilitarios[12]["id_server"] +'**', value: "`"+ guild.id +"`", inline: true },
            { name: ':busts_in_silhouette: **'+ utilitarios[12]["membros"] +'**', value: ':bust_in_silhouette: **'+ utilitarios[12]["atual"] +':** `'+ qtd_membros.toLocaleString('pt-BR') +'`\n:arrow_up: **Max: **`'+ guild.maximumMembers.toLocaleString('pt-BR') +"`", inline: true},
            { name: ':unicorn: **'+ utilitarios[12]["dono"] +'**', value: dono_sv, inline: true},
        )
        .addFields(
            { name: ':placard: **'+ utilitarios[12]["canais"] +' ( '+ qtd_canais +' )**', value: ':card_box: **'+ utilitarios[12]["categorias"] +':** `'+ categorias +'`\n:notepad_spiral: **'+ utilitarios[12]["texto"] +':** `'+ canais_texto +'` \n:speaking_head: **'+ utilitarios[12]["voz"] +':** `'+ canais_voz +'`', inline: true},
            { name: ':vulcan: **'+ utilitarios[12]["entrada"] +'**', value: `\`${data_entrada}\`\n[ \`${diferenca_entrada}\` ]`, inline: true},
            { name: ':birthday: **'+ utilitarios[12]["criacao"] +'**', value: `\`${data_criacao}\`\n[ \`${diferenca_criacao}\` ]`, inline: true}
        )
        .addFields(
            { name: ':shield: **'+ utilitarios[12]["verificacao"] +'**', value: `**${utilitarios[12][guild.verificationLevel]}**`, inline: true},
            { name: emoji_dancando +' **Emojis ( '+ guild.emojis.cache.size +' )**', value: figurinhas +' **'+ utilitarios[12]["figurinhas"] +' ('+  guild.stickers.cache.size +')**', inline: true}
        );
        
        if(guild.premiumSubscriptionCount > 0)
            infos_sv.addFields(
                { name: boost_sv +'**Boosts ( '+ guild.premiumSubscriptionCount +' )**', value: '⠀', inline: true}
            )
        else
            infos_sv.addFields(
                { name: '⠀', value: '⠀', inline: true}
            )

        return message.reply({embeds: [infos_sv]});
    }
}