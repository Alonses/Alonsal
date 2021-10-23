module.exports = {
    name: "tempo",
    description: "Veja informações do tempo em alguma cidade",
    aliases: [ "t", "clima", "previsao", "weather", "we" ],
    usage: "t Brasil",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        const idioma_adotado = client.idioma.getLang(message.guild.id);
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_adotado +'.json');

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";
            
        function direcao_cardial(degrees){
            let direcao = parseInt((degrees / 22.5) + 0.5);

            if(idioma_adotado === "pt-br")
                cards = ["Norte", "N/NL", "Nordeste", "L/NL", "Leste", "L/SL", "Sudeste", "S/SL", "Sul", "S/SO", "Sudoeste", "O/SO", "Oeste", "O/NO", "Noroeste", "N/NO"];
            else
                cards = ["North", "N/NL", "North East", "L/NL", "East", "L/SL", "Southeast", "S/SL", "Sul", "S/SO", "South-west", "O/SO", "West", "O/NO", "Northwest", "N/NO"];
            
            direcao = cards[direcao % 16];

            return direcao;
        }

        const { MessageEmbed } = require('discord.js');
        
        const fetch = require('node-fetch');
        const { weather_key, time_key } = require('../../config.json');
        const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

        const translations = require("i18n-country-code/locales/"+ idioma_adotado.slice(0, 2) +".json");
        
        const getCountryISO3 = require("country-iso-2-to-3");
        
        const base_url = "http://api.openweathermap.org/data/2.5/weather?";
        const time_url = "http://api.timezonedb.com/v2.1/get-time-zone?";

        let pesquisa = "";
        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

        if(args.length < 1) // Pesquisa sem argumentos
            return message.reply(":warning: | "+ utilitarios[8]["aviso_1"].replaceAll(".a", prefix));

        for(let i = 0; i < args.length; i++){
            if(isNaN(args[i]))
                pesquisa += args[i].normalize("NFD").replace(/[^a-zA-Zs]/g, "");
            else
                pesquisa += args[i];

            if(args[i + 1] !== undefined)
                pesquisa += " ";
        }
        
        let url_completa = base_url +"appid="+ weather_key +"&q="+ pesquisa + "&units=metric&lang=pt";
        
        if(idioma_adotado === "en-us")
            url_completa = url_completa.replace("&lang=pt", "");
        
        fetch(url_completa)
        .then(response => response.json())
        .then(async res => {

            if(res.cod === '404' || res.cod === '400')
                message.reply(emoji_nao_encontrado +" | "+ utilitarios[8]["aviso_2"] +" \`"+ pesquisa +"\`"+ utilitarios[8]["tente_novamente"]);
            else if(res.cod === '429')
                message.reply(emoji_nao_encontrado +" | "+ utilitarios[8]["aviso_3"]);
            else{
                let url_hora = time_url +"key="+ time_key + "&format=json&by=position&lat="+ res.coord.lat +"&lng="+ res.coord.lon;

                fetch(url_hora) // Buscando o horário local
                .then(response => response.json())
                .then(async res_hora => {

                    let bandeira_pais = "";
                    let nome_pais = "";
                    let aviso_continente = utilitarios[8]["aviso_continente"];
                    let horario_local;

                    if(typeof res.sys.country != "undefined"){
                        bandeira_pais = ' :flag_'+ (res.sys.country).toLowerCase() +':';
                        
                        let cod_pais = getCountryISO3(res.sys.country);
                        nome_pais = " - "+ translations[cod_pais];
                        aviso_continente = "";

                        if(nome_pais.includes(res.name)){
                            nome_pais = "";
                            aviso_continente = utilitarios[8]["aviso_pais"];
                        }

                        horario_local = res_hora.formatted;
                        horario_local = new Date(horario_local);
                    }else
                        horario_local = new Date(res.dt * 1000);
                    
                    let nascer_sol = new Date((res.sys.sunrise + res.timezone) * 1000);
                    let por_sol = new Date((res.sys.sunset + res.timezone) * 1000);

                    nascer_sol = ("0" + nascer_sol.getHours()).substr(-2) +":"+ ("0" + nascer_sol.getMinutes()).substr(-2);
                    por_sol = ("0" + por_sol.getHours()).substr(-2) +":"+ ("0" + por_sol.getMinutes()).substr(-2);

                    let tempo_atual = res.weather[0].description; // Clima atual
                    tempo_atual = tempo_atual.charAt(0).toUpperCase() + tempo_atual.slice(1);

                    let minutos = ("0" + horario_local.getMinutes()).substr(-2); // Preservar o digito 0
                    let hora = ("0" + horario_local.getHours()).substr(-2); // Preservar o digito 0
                    let dia = horario_local.getDate();
                    
                    let mes = horario_local.toLocaleString('pt', { month: 'long' });
                    
                    if(idioma_adotado === "en-us")
                        mes = horario_local.toLocaleString('en', { month: 'long' });

                    let hours = horario_local.getHours();

                    hours = hours % 12;
                    hours = hours ? hours : 12;

                    if(minutos >= 30)
                        hours += "30";

                    let emoji_ceu_atual = ":park:";

                    // Umidade
                    let emoji_umidade = ":sweat_drops:";

                    if(res.main.humidity < 60)
                        emoji_umidade = ":droplet:";
                    
                    if(res.main.humidity < 30)
                        emoji_umidade = ":cactus:";

                    // Nuvens
                    let emoji_nuvens = ":cloud:";

                    if(res.clouds.all < 60)
                        emoji_nuvens = ":white_sun_cloud:"

                    if(res.clouds.all < 41)
                        emoji_nuvens = ":white_sun_small_cloud:";

                    if(res.clouds.all < 31){
                        emoji_nuvens = ":sunny:";

                        if(hora > 17 || hora < 7) // Noite
                            emoji_nuvens = ":full_moon_with_face:";
                    }

                    if(hora > 17 || hora < 7)
                        emoji_ceu_atual = ":milky_way:";

                    // Sensação térmica dinâmica
                    let emoji_sensacao_termica = ":hot_face:";

                    if(res.main.feels_like >= 13 && res.main.feels_like <= 30)
                        emoji_sensacao_termica = ":ok_hand:";    

                    if(res.main.feels_like < 13)
                        emoji_sensacao_termica = ":cold_face:";

                    if(res.main.feels_like < 0)
                        emoji_sensacao_termica = ":snowman2:";

                    if(res.main.feels_like >= 35)
                        emoji_sensacao_termica = ":fire:";
                    
                    horario_local = ":clock"+ hours +": **Hora local:** `"+ hora +":"+ minutos +" | "+ dia +" de "+ mes;

                    if(idioma_adotado === "en-us"){
                        horario_local = horario_local.replace("Hora local", "Local time");
                        horario_local = horario_local.replace("de", "of");
                    }

                    let direcao_vento = direcao_cardial(res.wind.deg);

                    let nome_local = "na "+ res.name;

                    if(idioma_adotado === "en-us")
                        nome_local = nome_local.replace("na", "in");
                    if(typeof res.sys.country != "undefined")
                        if(idioma_adotado === "pt-br")
                            nome_local = nome_local.replace("na", "em");
                    
                    else
                        if(idioma_adotado === "pt-br")
                            horario_local = horario_local.replace("Hora local", "Dados de");
                        else
                            horario_local = horario_local.replace("Local time", "Data from");

                    let infos_chuva = "";

                    if(typeof res.rain != "undefined"){
                        infos_chuva = "\n **Chuva 1H:** `"+ res.rain["1h"]+ "mm`";
                    
                        if(idioma_adotado === "en-us")
                            infos_chuva = infos_chuva.replace("Chuva", "Rain");

                        if(typeof res.rain["3h"] != "undefined"){
                            infos_chuva += "\n **Chuva 3H:** `"+ res.rain["3h"]+ "mm`";

                            if(idioma_adotado === "en-us")
                                infos_chuva = infos_chuva.replace("Chuva", "Rain");
                        }
                    }
       
                    let cidade_encontrada = new MessageEmbed()
                    .setTitle(":boom: "+ utilitarios[8]["tempo_agora"] +" "+ nome_local +""+ nome_pais +" "+ bandeira_pais)
                    .setColor(0x29BB8E)
                    .setDescription(horario_local +"` | **"+ tempo_atual +"**")
                    .setThumbnail("http://openweathermap.org/img/wn/"+ res.weather[0].icon +"@2x.png")
                    .addFields(
                        { name: ':thermometer: **'+ utilitarios[8]["temperatura"] +'**', value: ":small_orange_diamond: **"+ utilitarios[12]["atual"] +"**: `"+ res.main.temp +"°C`\n:small_red_triangle: **Max:** `"+ res.main.temp_max +"°C`\n:small_red_triangle_down: **Min:** `"+ res.main.temp_min +"°C`", inline: true },
                        { name: emoji_ceu_atual +' **'+ utilitarios[8]["ceu_momento"] +'**', value: emoji_nuvens +' **'+ utilitarios[8]["nuvens"] +': **`'+ res.clouds.all +'%`\n:sunrise: **'+ utilitarios[8]["nas_sol"] +': **`'+ nascer_sol +"`\n:city_sunset: **"+ utilitarios[8]["por_sol"] +": **`"+ por_sol +"`", inline: true},
                        { name: ':wind_chime: **'+ utilitarios[8]["vento"] +'**', value: ":airplane: **Vel.: **`"+ res.wind.speed +" km/h`\n:compass: **"+ utilitarios[8]["direcao"] +": ** `"+ direcao_vento +"`", inline: true },
                    )
                    .addFields(
                        { name: emoji_sensacao_termica +' **'+ utilitarios[8]["sensacao_termica"] +'.**', value: '**'+ utilitarios[12]["atual"] +': **`'+ res.main.feels_like +'°C`', inline: true},
                        { name: emoji_umidade +' **'+ utilitarios[8]["umidade_ar"] +'**', value: "**"+ utilitarios[12]["atual"] +": **`"+ res.main.humidity +"%`"+ infos_chuva, inline: true },
                        { name: ':compression: **'+ utilitarios[8]["pressao_ar"] +'**', value: '**'+ utilitarios[12]["atual"] +': **`'+ res.main.pressure +' kPA`', inline: true}
                    )
                    .setFooter(aviso_continente);
                   
                    message.reply({ embeds: [cidade_encontrada] });
                });
            }
        });
    }
};