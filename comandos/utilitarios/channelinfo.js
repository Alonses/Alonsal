const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "channelinfo",
    description: "Veja detalhes de algum canal",
    aliases: [ "chinfo", "cinfo" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const getDateDiff = require('../../adm/funcoes/diffdatas.js');
        const formata_data = require('../../adm/funcoes/formatadata.js');
        const idioma_selecionado = client.idioma.getLang(message.guild.id);
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_selecionado}.json`);

        let canal = message.channel;
        
        if(typeof args[0] !== "undefined"){ // ID's customizados para canais aleatórios, marcando ou não
            let id_canal = args[0].raw;

            if(id_canal.includes("<#"))
                id_canal = id_canal.replace("<#", "").replace(">", "");
            
            if(isNaN(id_canal)) return message.reply(utilitarios[15]["aviso_1"]);

            try{
                canal = await client.channels.fetch(id_canal); // Coletando os dados do canal informado
            }catch(err){
                return message.reply(`:octagonal_sign: | ${utilitarios[15]["error_1"]}`);
            }
        }

        let nsfw = utilitarios[9]["nao"];
        if (canal.nsfw)
            nsfw = utilitarios[9]["sim"];
        
        const data_atual = new Date();
        const data_criacao = formata_data(new Date(canal.createdAt), idioma_selecionado); // Criação do canal
        const diferenca_criacao = getDateDiff(new Date(canal.createdAt), data_atual, utilitarios);
        let userlimit, bitrate = "";

        let topico = `\`\`\`${canal.topic}\`\`\``;
        if(!canal.topic)
            topico = `\`\`\`${utilitarios[15]["sem_topico"]}\`\`\``;
        
        if(typeof canal.bitrate !== "undefined"){
            topico = `\`\`\`🔊 ${utilitarios[15]["canal_voz"]}\`\`\``;

            userlimit = canal.userLimit;

            if(userlimit === 0)
                userlimit = utilitarios[15]["sem_limite"];

            bitrate = `${canal.bitrate / 1000}kbps`;
        }

        let icone_server = canal.guild.iconURL({ size: 2048 });
        icone_server = icone_server.replace(".webp", ".gif");

        fetch(icone_server)
        .then(res => {
            if(res.status !== 200)
                icone_server = icone_server.replace('.gif', '.webp')

            const infos_ch = new MessageEmbed()
                .setAuthor(canal.name, icone_server)
                .setColor(0x29BB8E)
                .setDescription(topico)
                .addFields(
                    {
                        name: `:globe_with_meridians: **${utilitarios[15]["id_canal"]}**`,
                        value: `\`${canal.id}\``,
                        inline: true
                    },
                    {
                        name: `:label: **${utilitarios[15]["mencao"]}**`,
                        value: `\`<#${canal.id}>\``,
                        inline: true
                    },
                );

            if(bitrate === "")
                infos_ch.addFields(
                    { 
                        name: ':underage: NSFW',
                        value: `\`${nsfw}\``,
                        inline: true
                    }
                )
            else
                infos_ch.addFields({  name: '⠀', value: '⠀', inline: true })

            infos_ch.addFields(
                { 
                    name: `:birthday: ${utilitarios[12]["criacao"]}`,
                    value: `${data_criacao}\n [ \`${diferenca_criacao}\` ]`,
                    inline: true
                }
            )
            .setFooter(`${utilitarios[15]["servidor"]}: ${canal.guild.name}`, message.author.avatarURL({ dynamic:true }));
            
            if(typeof canal.bitrate !== "undefined")
                infos_ch.addFields(
                    { 
                        name: `:mega: ${utilitarios[15]["transmissao"]}`,
                        value: `:radio: **Bitrate: **\`${bitrate}\`\n:busts_in_silhouette: **Max. users: **\`${userlimit}\``,
                        inline: true
                    }
                )

            if(typeof canal.rateLimitPerUser !== "undefined")
                if(canal.rateLimitPerUser > 0)
                    infos_ch.addFields(
                        { 
                            name: `:name_badge: ${utilitarios[15]["modo_lento"]}`,
                            value: `\`${canal.rateLimitPerUser} segundos\``,
                            inline: true
                        }
                    )
            
            return message.reply({embeds: [infos_ch]});
        });
    }
}