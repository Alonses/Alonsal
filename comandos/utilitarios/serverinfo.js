const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "serverinfo",
    description: "Veja detalhes do servidor",
    aliases: [ "svinfo" ],
    cooldown: 1,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        const idioma_selecionado = idioma_servers[message.guild.id];

        const guild = message.guild;

        let dono_sv = guild.ownerId;
        dono_membro = await guild.members.cache.get(dono_sv);
        dono_sv = "`"+ dono_membro.user.username + "#"+ dono_membro.user.discriminator +"`\n`"+ dono_sv +"`";
        
        let icone_server = guild.iconURL({ size: 2048 });

        let qtd_canais = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size;
        let canais_texto = guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
        let canais_voz = guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
        let categorias = guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size;

        let qtd_membros = guild.memberCount - 1; 

        let data_entrada = new Date(guild.joinedTimestamp); // Entrada do bot no server
        if(idioma_selecionado == "pt-br")
            data_entrada = data_entrada.getDate() +" de "+ data_entrada.toLocaleString('pt', { month: 'long' }) +" de "+ data_entrada.getFullYear() +" às "+ ("0"+ data_entrada.getHours()).substr(-2) +":"+ ("0"+ data_entrada.getMinutes()).substr(-2);
        else
            data_entrada = data_entrada.toLocaleString('en', { month: 'long' }) +" "+ data_entrada.getDate() +", "+ data_entrada.getFullYear() +" at "+ ("0"+ data_entrada.getHours()).substr(-2) +":"+ ("0"+ data_entrada.getMinutes()).substr(-2);

        let data_criacao = new Date(guild.createdAt); // Criação do servidor
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

        let infos_sv = new MessageEmbed()
        .setTitle(guild.name)
        .setColor(0x29BB8E)
        .setThumbnail(icone_server)
        .addFields(
            { name: ':globe_with_meridians: **'+ utilitarios[12]["id_server"] +'**', value: "`"+ guild.id +"`", inline: true },
            { name: ':busts_in_silhouette: **'+ utilitarios[12]["membros"] +'**', value: ':bust_in_silhouette: **Atual:** `'+ qtd_membros +'`', inline: true},
            { name: ':unicorn: **'+ utilitarios[12]["dono"] +'**', value: dono_sv, inline: true},
        )
        .addFields(
            { name: ':placard: **'+ utilitarios[12]["canais"] +' ( '+ qtd_canais +' )**', value: ':card_box: **'+ utilitarios[12]["categorias"] +':** `'+ categorias +'`\n:notepad_spiral: **'+ utilitarios[12]["texto"] +':** `'+ canais_texto +'` \n:speaking_head: **'+ utilitarios[12]["voz"] +':** `'+ canais_voz +'`', inline: true},
            { name: ':vulcan: **'+ utilitarios[12]["entrada"] +'**', value: `\`${data_entrada}\``, inline: true},
            { name: ':birthday: **'+ utilitarios[12]["criacao"] +'**', value: `\`${data_criacao}\``, inline: true}
        )
        .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));
        
        return message.reply({embeds: [infos_sv]});
    }
}