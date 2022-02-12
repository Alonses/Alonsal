const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const getDateDiff = require('../../adm/funcoes/diffdatas.js');
const formata_data = require('../../adm/funcoes/formatadata.js');
const { emojis, emojis_negativos } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "userinfo",
    description: "Veja detalhes de algum usuario",
    aliases: [ "usinfo", "usuarioinfo", "usif" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const idioma_selecionado = client.idioma.getLang(message.guild.id);
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_selecionado}.json`);
        
        const ids_enceirados = ["597926883069394996", "665002572926681128", "610525028076748800", "678061682991562763", "813149555553468438", "434089428160348170", "735644852385087529"];

        let user = message.mentions.users.first(); // Coleta o ID do usuário
        let nota_rodape = "";

        const emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        if (!user && typeof args[0] !== "undefined") {
            if (isNaN(Number(args[0].value)))
                return message.reply(`:octagonal_sign: | ${utilitarios[4]["id_user"]}`);

            try {
                user = await message.guild.members.fetch(args[0].raw);

                user = user.user; // Pega o usuário pelo ID
            } catch (e) {
                return message.reply(`${emoji_nao_encontrado} | ${utilitarios[4]["nao_conhecido"]}`);
            }
        }

        if(typeof user === "undefined")
            user = message.author;

        let avatar_user = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=512`;
        const data_atual = new Date();

        const membro_sv = message.guild.members.cache.get(user.id); // Coleta dados como membro
        let data_entrada = formata_data(new Date(membro_sv.joinedTimestamp), idioma_selecionado);
        let diferenca_entrada = getDateDiff(new Date(membro_sv.joinedTimestamp), data_atual, utilitarios);

        let data_criacao = formata_data(new Date(user.createdAt), idioma_selecionado); // Cadastro do user
        let diferenca_criacao = getDateDiff(new Date(user.createdAt), data_atual, utilitarios);

        if (avatar_user !== null) {
            avatar_user = avatar_user.replace(".webp", ".gif");

            await fetch(avatar_user)
                .then(res => {
                    if (res.status !== 200)
                        avatar_user = avatar_user.replace('.gif', '.webp')
                });
        } else
            avatar_user = "";

        let apelido = user.username;
        if (membro_sv.nickname != null)
            apelido = membro_sv.nickname;

        if (user.bot)
            apelido = `:robot: ${apelido}`;

        if (membro_sv.permissions.has("ADMINISTRATOR")) {
            apelido = `:shield: ${apelido}`;
            nota_rodape = utilitarios[13]["moderador"];
        }

        if (user.id === client.user.id)
            nota_rodape = utilitarios[13]["alonsal"];

        if (ids_enceirados.includes(user.id)) {
            if (nota_rodape !== "")
                nota_rodape += ", ";

            nota_rodape += utilitarios[13]["enceirado"];
        }
        
        const permissoes_user = membro_sv.permissions.toArray();
        let permissoes_fn = "";

        for(let i = 0; i < permissoes_user.length; i++){

            if(typeof permissoes_user[i + 1] === "undefined")
                permissoes_fn += " & ";

            permissoes_fn += `\`${permissoes_user[i]}\``;

            if(typeof permissoes_user[i + 2] !== "undefined")
                permissoes_fn += ", ";
        }

        permissoes_fn = permissoes_fn.slice(0, 2000);
        let emoji_hypesquad = ":x:";
        let discord_premium = "⠀";

        if(membro_sv.premiumSinceTimestamp) // Assinante do Discord
            discord_premium = client.emojis.cache.get(emojis.boost).toString();

        if(user.flags.has("HOUSE_BRAVERY")) // HypeSquad
            emoji_hypesquad = client.emojis.cache.get(emojis.squad_bravery).toString();

        if(user.flags.has("HOUSE_BALANCE"))
            emoji_hypesquad = client.emojis.cache.get(emojis.squad_balance).toString();
        
        if(user.flags.has("HOUSE_BRILLIANCE"))
            emoji_hypesquad = client.emojis.cache.get(emojis.squad_brilliance).toString();

        const infos_user = new MessageEmbed()
            .setTitle(apelido)
            .setColor(0x29BB8E)
            .setThumbnail(avatar_user)
            .addFields(
                {
                    name: ':globe_with_meridians: **Discord**',
                    value: `\`${user.username.replace(/ /g, "")}#${user.discriminator}\``,
                    inline: true
                },
                {
                    name: `:label: **Discord ID**`,
                    value: `\`${user.id}\``,
                    inline: true
                },
                {
                    name: `**HypeSquad ( ${emoji_hypesquad} )**`,
                    value: `${discord_premium}`,
                    inline: true
                }
            )
            .addFields(
                {
                    name: `:birthday: **${utilitarios[13]["conta_criada"]}**`,
                    value: `${data_criacao}\n[ \`${diferenca_criacao}\` ]`,
                    inline: false
                },
                {
                    name: `:parachute: **${utilitarios[13]["entrada"]}**`,
                    value: `${data_entrada}\n[ \`${diferenca_entrada}\` ]`,
                    inline: false
                }
            )
            .setFooter(nota_rodape);

        const permissoes = new MessageEmbed()
        .setTitle(apelido)
        .setColor(0x29BB8E)
        .setThumbnail(avatar_user)
        .addFields({
            name: "Permissões", value: `${permissoes_fn}`, inline: true
        })
        .setFooter(nota_rodape);

        let paginas = [
            infos_user,
            permissoes
        ];

        message.reply({embeds: [paginas[0]]});
        // let reacoes = ['◀️', '▶️'];

        // reacoes.forEach(async reacao => {
        //     await embed_pags.react(reacao);
        // });
        
        // const filter = (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
        // embed_pags.awaitReactions({ filter, max: 2, time: 20000, errors: ['time'] })
        // .then(collected => {
        //     const reaction = collected.first();
    
        //     if (reaction.emoji.name === '▶️')
        //         embed_pags.edit({embeds: [paginas[1]]});
        //     else
        //         embed_pags.edit({embeds: [paginas[0]]});
        // })
        // .catch(() => embed_pags.reactions.removeAll());
    }
}