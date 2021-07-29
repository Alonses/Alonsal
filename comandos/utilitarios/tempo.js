module.exports = {
    name: "tempo",
    description: "Veja informações do tempo em alguma cidade",
    aliases: [ "tp", "t", "clima", "previsao" ],
    usage: ".at brasil",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { MessageEmbed } = require('discord.js');
        
        const fetch = require('node-fetch');
        const { weather_key, time_key } = require('../../config.json');

        const translations = require("i18n-country-code/locales/pt.json");
        const getCountryISO3 = require("country-iso-2-to-3");
        
        const base_url = "http://api.openweathermap.org/data/2.5/weather?";
        const time_url = "http://api.timezonedb.com/v2.1/get-time-zone?";

        let pesquisa = "";

        if(args.length < 1){
            message.channel.send(`${message.author} informe o nome de alguma cidade para buscar\nPor exemplo como \`.at sao paulo\``);
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
        .then( async res => {
            if(res.cod == '404')
                message.channel.send(`${message.author} não encontrei nada relacionado a \``+ pesquisa +`\`, tente novamente`);
            else{
                let url_hora = time_url +"key="+ time_key + "&format=json&by=position&lat="+ res.coord.lat +"&lng="+ res.coord.lon;

                fetch(url_hora) // Buscando o horário local
                .then(response => response.json())
                .then( async res_hora => {
                    let bandeira_pais = ' :flag_'+ (res.sys.country).toLowerCase() +':';
                    
                    let cod_pais = getCountryISO3(res.sys.country);
                    let nome_pais = translations[cod_pais];
                    
                    let tempo_atual = res.weather[0].description; // Clima atual
                    tempo_atual = tempo_atual.charAt(0).toUpperCase() + tempo_atual.slice(1);

                    let horario_local = res_hora.formatted;
                    horario_local = new Date(horario_local);

                    let minutos = ("0" + horario_local.getMinutes()).substr(-2); // Preservar o digito 0
                    let hora = ("0" + horario_local.getHours()).substr(-2); // Preservar o digito 0
                    let dia = horario_local.getDate();
                    
                    mes = horario_local.toLocaleString('pt', { month: 'long' });
                    hours = horario_local.getHours();

                    hours = hours % 12;
                    hours = hours ? hours : 12;

                    if(minutos >= 30)
                        hours += "30";

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

                        if(hora > 18 || hora < 6) // Noite
                            emoji_nuvens = ":full_moon_with_face:";
                    }

                    // Sensação térmica dinâmica
                    emoji_sensacao_termica = ":hot_face:";

                    if(res.main.feels_like >= 15 && res.main.feels_like < 25)
                        emoji_sensacao_termica = ":ok_hand:";    

                    if(res.main.feels_like < 15)
                        emoji_sensacao_termica = ":cold_face:";

                    if(res.main.feels_like < 0)
                        emoji_sensacao_termica = ":snowman2:";

                    if(res.main.feels_like > 39)
                        emoji_sensacao_termica = ":fire:";
                    
                    horario_local = hora +":"+ minutos +" | "+ dia +" de "+ mes;
                    let relogio_emoji = ":clock"+ hours +":";

                    const cidade_encontrada = new MessageEmbed()
                    .setTitle(':boom: Tempo agora em '+ res.name + ' - '+ nome_pais + ' '+ bandeira_pais)
                    .setColor(0x29BB8E)
                    .setDescription(relogio_emoji +' **Hora local:** `'+ horario_local +'` | **'+ tempo_atual +'**')
                    .setThumbnail('http://openweathermap.org/img/wn/'+ res.weather[0].icon +'@2x.png')
                    .addFields(
                        { name: ':thermometer: **Temperatura**', value: ":small_orange_diamond: **Atual**: `"+ res.main.temp +"°C`\n:small_red_triangle: **Máxima:** `"+ res.main.temp_max +"°C`\n:small_red_triangle_down: **Mínima:** `"+ res.main.temp_min +"°C`", inline: true },
                        { name: emoji_umidade +' **Umidade**', value: "**Atual: **`"+ res.main.humidity +"%`", inline: true },
                        { name: ':wind_chime: **Velocidade do vento**', value: " **Atual: **`"+ res.wind.speed +" km/h`", inline: true },
                    )
                    .addFields(
                        { name: emoji_sensacao_termica +' **Sensação Térmica**', value: '**Atual: **`'+ res.main.feels_like +'°C`', inline: true},
                        { name: emoji_nuvens +' **Nuvens no céu**', value: '**Atual: **`'+ res.clouds.all +'%`', inline: true},
                        { name: ':compression: **Pressão do ar**', value: '**Atual: **`'+ res.main.pressure +' kPA`', inline: true}

                    );

                    message.channel.send(cidade_encontrada);
                });
            }
        });
    }
};