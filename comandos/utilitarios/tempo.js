module.exports = {
    name: "tempo",
    description: "Veja informações do tempo em alguma cidade",
    aliases: [ "tp", "t", "clima", "previsao" ],
    usage: "t Brasil",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        function direcao_cardial(degrees){
            let direcao = parseInt((degrees / 22.5) +.5);

            const cards = ["Norte","N/NL","Nordeste","L/NL","Leste","L/SL", "Sudeste", "S/SL","Sul","S/SO","Sudoeste","O/SO","Oeste","O/NO","Noroeste","N/NO"]
            direcao = cards[direcao % 16];

            return direcao;
        }

        const { MessageEmbed } = require('discord.js');
        
        const fetch = require('node-fetch');
        const { weather_key, time_key } = require('../../config.json');
        const { emojis_negativos } = require('../../arquivos/json/text/emojis.json');

        const translations = require("i18n-country-code/locales/pt.json");
        const getCountryISO3 = require("country-iso-2-to-3");
        
        const base_url = "http://api.openweathermap.org/data/2.5/weather?";
        const time_url = "http://api.timezonedb.com/v2.1/get-time-zone?";

        let pesquisa = "";

        const num_esc = Math.round((emojis_negativos.length - 1) * Math.random());
        let emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[num_esc]).toString();

        if(args.length < 1){
            message.lineReply(":warning: | Informe o nome de alguma cidade para buscar\nPor exemplo, como `.at sao paulo`");
            return;
        }

        for(let i = 0; i < args.length; i++){
            pesquisa += args[i].normalize("NFD").replace(/[^a-zA-Zs]/g, "");

            if(args[i + 1] !== undefined)
                pesquisa += " ";
        }

        let url_completa = base_url +"appid="+ weather_key +"&q="+ pesquisa + "&units=metric&lang=pt";
        
        fetch(url_completa)
        .then(response => response.json())
        .then(async res => {
            if(res.cod == '404')
                message.lineReply(emoji_nao_encontrado +" | Não encontrei nenhum local chamado \`"+ pesquisa +"\`, tente novamente");
            else if(res.cod == '429')
                message.lineReply(emoji_nao_encontrado +" | Houve algum erro com a API de clima e não é possível pesquisar por climas no momento");
            else{
                let url_hora = time_url +"key="+ time_key + "&format=json&by=position&lat="+ res.coord.lat +"&lng="+ res.coord.lon;

                fetch(url_hora) // Buscando o horário local
                .then(response => response.json())
                .then( async res_hora => {

                    let bandeira_pais = "";
                    let nome_pais = "";
                    let aviso_continente = "Estes dados são uma média de todos os valores do continente pesquisado";
                    let horario_local;

                    if(typeof res.sys.country != "undefined"){
                        bandeira_pais = ' :flag_'+ (res.sys.country).toLowerCase() +':';
                    
                        let cod_pais = getCountryISO3(res.sys.country);
                        nome_pais = " - "+ translations[cod_pais];
                        aviso_continente = "";

                        horario_local = res_hora.formatted;
                        horario_local = new Date(horario_local);
                    }else
                        horario_local = new Date(res.dt * 1000);
                    
                    nascer_sol = new Date(res.sys.sunrise * 1000);
                    por_sol = new Date(res.sys.sunset * 1000);

                    nascer_sol = ("0" + nascer_sol.getHours()).substr(-2) +":"+ ("0" + nascer_sol.getMinutes()).substr(-2);
                    por_sol = ("0" + por_sol.getHours()).substr(-2) +":"+ ("0" + por_sol.getMinutes()).substr(-2);

                    let tempo_atual = res.weather[0].description; // Clima atual
                    tempo_atual = tempo_atual.charAt(0).toUpperCase() + tempo_atual.slice(1);

                    let minutos = ("0" + horario_local.getMinutes()).substr(-2); // Preservar o digito 0
                    let hora = ("0" + horario_local.getHours()).substr(-2); // Preservar o digito 0
                    let dia = horario_local.getDate();
                    
                    mes = horario_local.toLocaleString('pt', { month: 'long' });
                    hours = horario_local.getHours();

                    hours = hours % 12;
                    hours = hours ? hours : 12;

                    if(minutos >= 30)
                        hours += "30";

                    emoji_ceu_atual = ":park:";

                    // Umidade
                    emoji_umidade = ":sweat_drops:";

                    if(res.main.humidity < 60)
                        emoji_umidade = ":droplet:";
                    
                    if(res.main.humidity < 30)
                        emoji_umidade = ":cactus:";

                    // Nuvens
                    emoji_nuvens = ":cloud:";

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
                    emoji_sensacao_termica = ":hot_face:";

                    if(res.main.feels_like >= 13 && res.main.feels_like <= 30)
                        emoji_sensacao_termica = ":ok_hand:";    

                    if(res.main.feels_like < 13)
                        emoji_sensacao_termica = ":cold_face:";

                    if(res.main.feels_like < 0)
                        emoji_sensacao_termica = ":snowman2:";

                    if(res.main.feels_like >= 35)
                        emoji_sensacao_termica = ":fire:";
                    
                    horario_local = ":clock"+ hours +": **Hora local:** `"+ hora +":"+ minutos +" | "+ dia +" de "+ mes;

                    let direcao_vento = direcao_cardial(res.wind.deg);

                    let nome_local = "na "+ res.name;

                    if(typeof res.sys.country != "undefined")
                        nome_local = nome_local.replace("na", "em");
                    else
                        horario_local = horario_local.replace("Hora local", "Dados de");

                    const cidade_encontrada = new MessageEmbed()
                    .setTitle(':boom: Tempo agora '+ nome_local +''+ nome_pais +' '+ bandeira_pais)
                    .setColor(0x29BB8E)
                    .setDescription(horario_local +'` | **'+ tempo_atual +'**')
                    .setThumbnail('http://openweathermap.org/img/wn/'+ res.weather[0].icon +'@2x.png')
                    .addFields(
                        { name: ':thermometer: **Temperatura**', value: ":small_orange_diamond: **Atual**: `"+ res.main.temp +"°C`\n:small_red_triangle: **Máxima:** `"+ res.main.temp_max +"°C`\n:small_red_triangle_down: **Mínima:** `"+ res.main.temp_min +"°C`", inline: true },
                        { name: emoji_ceu_atual +' **Céu no momento**', value: emoji_nuvens +' **Nuvens: **`'+ res.clouds.all +'%`\n:sunrise: **Na. do sol: **`'+ nascer_sol +"`\n:city_sunset: **Pôr do sol: **`"+ por_sol +"`", inline: true},
                        { name: ':wind_chime: **Vento**', value: ":airplane: **Velo.: **`"+ res.wind.speed +" km/h`\n:compass: **Direção: ** `"+ direcao_vento +"`", inline: true },
                    )
                    .addFields(
                        { name: emoji_sensacao_termica +' **Sensação Térmica**', value: '**Atual: **`'+ res.main.feels_like +'°C`', inline: true},
                        { name: emoji_umidade +' **Umidade**', value: "**Atual: **`"+ res.main.humidity +"%`", inline: true },
                        { name: ':compression: **Pressão do ar**', value: '**Atual: **`'+ res.main.pressure +' kPA`', inline: true}
                    )
                    .setFooter(aviso_continente);

                    message.lineReply(cidade_encontrada);
                });
            }
        });
    }
};
