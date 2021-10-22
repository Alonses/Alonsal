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
        const idioma_definido = idioma_servers[message.guild.id];

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

                    // const fs = require('fs');

                    // fs.writeFile('./comandos/utilitarios/site2.html', res, (err) => {
                    //     if (err) throw err;
                    // });
                    
                    let bandeira_user, nivel_user, status_atual, jogos_user, insignias_user, conquistas_user, porcentagem_conquistas, capturas_user, videos_user, artes_user;
                    let jogo_favorito = "", tempo_jogado = "";
                    let nota_rodape = message.author.username;
                    let anos_servico = "";

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

                        if(res.includes("<div class=\"label\">Games Owned</div>")){
                            jogos_user = res.split("<div class=\"label\">Games Owned</div>")[0];
                            jogos_user = jogos_user.slice(jogos_user.length - 120).split("<div class=\"value\">")[1];
                            jogos_user = parseInt(jogos_user.split("</div>")[0]);
                        }
                    }

                    try{
                        insignias_user = res.split("<span class=\"count_link_label\">Badges</span>&nbsp;")[1];
                        insignias_user = insignias_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0];
                        insignias_user = parseInt(insignias_user);
                    }catch(err){
                        insignias_user = "-";
                    }
                    
                    try{
                        if(res.includes("<div class=\"label\">Achievements</div>")){
                            conquistas_user = res.split("<div class=\"label\">Achievements</div>")[0];
                            conquistas_user = conquistas_user.slice(conquistas_user.length - 120);
                            conquistas_user = conquistas_user.split("<div class=\"value\">")[1];
                            conquistas_user = conquistas_user.split("</div>")[0];
                        }else
                            conquistas_user = "-";
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

                    try{
                        artes_user = res.split("<span class=\"count_link_label\">Artwork</span>&nbsp;")[1];
                        artes_user = artes_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0];
                        artes_user = parseInt(artes_user);
                    }catch(err){
                        artes_user = "-";
                    }

                    if(res.includes("<div class=\"showcase_item_detail_title\">")){
                        let dados_jogo_fav = res.split("<div class=\"showcase_item_detail_title\">")[1];

                        jogo_favorito = dados_jogo_fav;
                        jogo_favorito = jogo_favorito.split("</a>")[0];
                        jogo_favorito = jogo_favorito.split("\">")[1];
                        jogo_favorito = jogo_favorito.replaceAll(/\t/g, "");

                        jogo_favorito = jogo_favorito.replaceAll(/[\n\r]/g, "");

                        tempo_jogado = dados_jogo_fav.split("<div class=\"showcase_stat\">")[1];
                        tempo_jogado = tempo_jogado.split("</div>")[0];
                        tempo_jogado = tempo_jogado.replace("<div class=\"value\">", "");
                        tempo_jogado = tempo_jogado.replace(",", ".");

                        descriminador_tempo = dados_jogo_fav.split("<div class=\"label\">")[1];
                        descriminador_tempo = descriminador_tempo.split("</div>")[0];
                        descriminador_tempo = descriminador_tempo.split(" ")[0].toLocaleLowerCase();

                        if(idioma_definido === "pt-br")
                            descriminador_tempo = utilitarios[16][descriminador_tempo];

                        tempo_jogado = parseFloat(tempo_jogado);

                        tempo_jogado = tempo_jogado +" "+ descriminador_tempo;
                    }

                    if(res.includes(" data-tooltip-html=\"Years of Service&lt;br&gt;")){

                        anos_servico = res.split(" data-tooltip-html=\"Years of Service&lt;br&gt;")[1];
                        anos_servico = anos_servico.split(".\" >")[0];
                        anos_servico = anos_servico.split("Member since ")[1];
                    }

                    if(reviews_user === "-" || jogos_perfeitos === "-" || porcentagem_conquistas === "-" || conquistas_user === "-" || insignias_user === "-" || jogos_user === "-" || status === "-" || insignias_user === "-" || videos_user === "-" || artes_user == "-")
                        nota_rodape = utilitarios[16]["rodape"];

                    if(jogos_user < jogos_perfeitos)
                        nota_rodape = utilitarios[16]["suspeito"];

                    let usuario_steam = new MessageEmbed()
                    .setTitle(nome_user +""+ bandeira_user)
                    .setURL(usuario_alvo)
                    .setThumbnail(avatar_user)
                    .setColor(0x29BB8E)
                    .addFields(
                        { name: ":ninja: "+ utilitarios[16]["nivel"], value: `**`+ utilitarios[12]["atual"] +`: **\`${nivel_user}\``, inline: true},
                        { name: ":video_game: "+ utilitarios[16]["jogos"] +" ( "+ jogos_user +" )", value: `:pencil: **`+ utilitarios[16]["analises"] +`: **\`${reviews_user}\``, inline: true},
                        { name: ":red_envelope: "+ utilitarios[16]["insignias"], value: `**Total: **\`${insignias_user}\``, inline: true},
                    )
                    .addFields(
                        { name: ":trophy: "+ utilitarios[16]["conquistas"], value: `**Total: **\`${conquistas_user}\`\n**`+ utilitarios[16]["porcentagem"] +`:** \`${porcentagem_conquistas}\`\n**`+ utilitarios[16]["jogos_perfeitos"] +`: **\`${jogos_perfeitos}\``, inline: true},
                        { name: ":piñata: "+ utilitarios[16]["criacoes"], value: `:frame_photo: **Screenshots: ** \`${capturas_user}\`\n:film_frames: **Videos: **\`${videos_user}\`\n:paintbrush: **`+ utilitarios[16]["artes"] +`: **\`${artes_user}\``, inline: true},
                        { name: ":mobile_phone_off: Status", value: `\`${status_atual}\``, inline: true}
                    )
                    .setFooter(nota_rodape, message.author.avatarURL({ dynamic:true }));

                    if(jogo_favorito !== "")
                        usuario_steam.addFields(
                            { name: ":star: "+ utilitarios[16]["jogo_favorito"], value: `**`+ utilitarios[16]["nome"] +`: **\`${jogo_favorito}\`\n:alarm_clock: **`+ utilitarios[16]["tempo_jogado"] +`: **\`${tempo_jogado}\``, inline: false}
                        )

                    if(anos_servico !== "")
                        usuario_steam.addFields(
                            { name: ":birthday: "+ utilitarios[13]["entrada"] , value: `\`${anos_servico}\``, inline: true}
                        )
                    
                    message.reply({ embeds: [usuario_steam] });
                });
            });
        }catch(err){
            client.channels.cache.get('862015290433994752').send(err);
            message.reply(utilitarios[16]["error_2"] +"\n<"+ usuario_alvo +">");
        }
    }
}