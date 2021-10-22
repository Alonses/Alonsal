const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "steamuser",
    description: "mostra o perfil da steam de um usuário",
    aliases: [ "sus", "stus" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){
        
        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        let buscar_id = "https://www.steamidfinder.com/lookup/"+ args[0];
        let id_usuario, usuario_alvo;

        try{
            fetch(buscar_id)
            .then(response => response.text())
            .then(async id_user => {

                try{
                    id_usuario = id_user.split("<br>steamID64 (Dec): <code>")[1];
                    id_usuario = id_usuario.split("</code>")[0];
                }catch(err){
                    return message.reply(utilitarios[16]["error_1"]);
                }

                usuario_alvo = "https://steamcommunity.com/profiles/"+ id_usuario;

                fetch(usuario_alvo)
                .then(response => response.text())
                .then(async res => {
                    
                    let status = res.split("<title>")[1];
                    status = status.split("</title>")[0];
                    status = status.replace("Steam Community :: ", "");
                    
                    if(status === "Error") return message.reply(utilitarios[16]["error_1"]);

                    let bandeira_user, nivel_user, status_atual, jogos_user, insignias_user, conquistas_user, porcentagem_conquistas, capturas_user, videos_user;
                    let nota_rodape = message.author.username;

                    try{
                        bandeira_user = res.split("<img class=\"profile_flag\"")[1];
                        bandeira_user = bandeira_user.split("\">")[0];
                        bandeira_user = bandeira_user.replace(".gif", "");
                        bandeira_user = bandeira_user.slice(bandeira_user.length - 2);
                        
                        bandeira_user = " | :flag_"+ bandeira_user +":";
                    }catch(err){
                        bandeira_user = "";
                    }

                    let nome_user = status;

                    let avatar_user = res.split("<div class=\"playerAvatarAutoSizeInner\">")[1];

                    if(avatar_user.includes("<div class=\"profile_avatar_frame\">")) // Verifica se o usuário possui decoração sob o avatar
                        avatar_user = avatar_user.split("</div>")[1];

                    avatar_user = avatar_user.split("</div>")[0];
                    avatar_user = avatar_user.replace("<img src=\"", "");
                    avatar_user = avatar_user.replace("\">", "");

                    try{
                        status_atual = res.split("<div class=\"profile_in_game_header\">")[1];
                        status_atual = status_atual.split("</div>")[0];
                        status_atual = status_atual.replace("Currently ", "");

                        if(status_atual === "undefined")
                            status_atual = utilitarios[16][status_atual];
                    }catch(err){
                        status = utilitarios[16]["undefined"];
                    }

                    try{
                        nivel_user = res.split("<span class=\"friendPlayerLevelNum\">")[1];
                        nivel_user = nivel_user.split("</span>")[0];
                    }catch(err){
                        nivel_user = "-";
                    }

                    try{
                        jogos_user = res.split("<span class=\"count_link_label\">Games</span>&nbsp;")[1];
                        jogos_user = jogos_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0];
                        jogos_user = parseInt(jogos_user);
                    }catch(err){
                        jogos_user = "-";
                    }

                    try{
                        insignias_user = res.split("<span class=\"count_link_label\">Badges</span>&nbsp;")[1];
                        insignias_user = insignias_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0];
                        insignias_user = parseInt(insignias_user);
                    }catch(err){
                        insignias_user = "-";
                    }
                    
                    try{
                        conquistas_user = res.split("<div class=\"label\">Achievements</div>")[0];
                        conquistas_user = conquistas_user.split("<div class=\"value\">")[1];
                        conquistas_user = conquistas_user.split("</div>")[0];
                    }catch(err){
                        conquistas_user = "-";
                    }

                    try{
                        porcentagem_conquistas = res.split("<div class=\"label\">Avg. Game Completion Rate</div>")[0];
                        porcentagem_conquistas = porcentagem_conquistas.slice(porcentagem_conquistas.length - 40);
                        porcentagem_conquistas = porcentagem_conquistas.split("<div class=\"value\">")[1];
                        porcentagem_conquistas = porcentagem_conquistas.split("</div>")[0];
                    }catch(err){
                        porcentagem_conquistas = "-";
                    }

                    try{
                        jogos_perfeitos = res.split("<div class=\"label\">Perfect Games</div>")[0];
                        jogos_perfeitos = jogos_perfeitos.slice(jogos_perfeitos.length - 40);
                        jogos_perfeitos = jogos_perfeitos.split("<div class=\"value\">")[1];
                        jogos_perfeitos = jogos_perfeitos.split("</div>")[0];
                    }catch(err){
                        jogos_perfeitos = "-";
                    }

                    try{
                        reviews_user = res.split("<span class=\"count_link_label\">Reviews</span>&nbsp;")[1];
                        reviews_user = reviews_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0];
                        reviews_user = parseInt(reviews_user);
                    }catch(err){
                        reviews_user = "-";
                    }

                    try{
                        capturas_user = res.split("<span class=\"count_link_label\">Screenshots</span>&nbsp;")[1];
                        capturas_user = capturas_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0];
                        capturas_user = parseInt(capturas_user);
                    }catch(err){
                        capturas_user = "-";
                    }

                    try{
                        videos_user = res.split("<span class=\"count_link_label\">Videos</span>&nbsp;")[1];
                        videos_user = videos_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0];
                        videos_user = parseInt(videos_user);
                    }catch(err){
                        videos_user = "-";
                    }

                    if(reviews_user === "-" || jogos_perfeitos === "-" || porcentagem_conquistas === "-" || conquistas_user === "-" || insignias_user === "-" || jogos_user === "-" || status === "-" || insignias_user === "-" || videos_user === "-")
                        nota_rodape = utilitarios[16]["rodape"];

                    const usuario_steam = new MessageEmbed()
                    .setTitle(nome_user +""+ bandeira_user)
                    .setURL(usuario_alvo)
                    .setThumbnail(avatar_user)
                    .setColor(0x29BB8E)
                    .addFields(
                        { name: ":ninja: "+ utilitarios[16]["nivel"], value: `**`+ utilitarios[12]["atual"] +`: **\`${nivel_user}\``, inline: true},
                        { name: ":video_game: "+ utilitarios[16]["jogos"] +" ( "+ jogos_user +" )", value: `:pencil: **Reviews: **\`${reviews_user}\``, inline: true},
                        { name: ":red_envelope: "+ utilitarios[16]["insignias"], value: `**Total: **\`${insignias_user}\``, inline: true},
                    )
                    .addFields(
                        { name: ":trophy: "+ utilitarios[16]["conquistas"], value: `**Total :** \`${conquistas_user}\`\n**`+ utilitarios[16]["porcentagem"] +`:** \`${porcentagem_conquistas}\`\n**`+ utilitarios[16]["jogos_perfeitos"] +`:** \`${jogos_perfeitos}\``, inline: true},
                        { name: ":piñata: Criações", value: `:frame_photo: **Screenshots: ** \`${capturas_user}\`\n:film_frames: **Videos: **\`${videos_user}\``, inline: true},
                        { name: ":mobile_phone_off: Status", value: `\`${status_atual}\``, inline: true}
                    )
                    .setFooter(nota_rodape, message.author.avatarURL({ dynamic:true }));

                    message.reply({ embeds: [usuario_steam] });
                });
            });
        }catch(err){
            client.channels.cache.get('862015290433994752').send(err);
            message.reply(utilitarios[16]["error_2"] +"\n <"+ usuario_alvo +">");
        }
    }
}