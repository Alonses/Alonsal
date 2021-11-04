const usersMap = new Map();
const LIMIT = 4;
const DIFF = 5000;

module.exports = async ({client, message}) => {

    const { rank_servidores } = require('../arquivos/data/rank/ranking.json');
    const fs = require('fs');

    function constructJson(id_guild, array_valores){
        return { [id_guild] : array_valores } // Montando servidores com usuários
    }

    function constructJson2(id_user, user, exp){ // Montando arrays de usuários e exp
        return { "id_user": id_user, "user": user, "exp" : exp }
    }

    if(message.content.length < 7) return; // Não contabiliza se houver menos que 7 caracteres

    let outputArray = []; // Transfere todos os dados do JSON para um array
    let valores = [];
    let msgCount = 0;
    let difference = 0;

    if(usersMap.has(message.author.id)){

        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        difference = message.createdTimestamp - lastMessage.createdTimestamp;
        msgCount = userData.msgCount;
    
        if(difference > DIFF){ 
            clearTimeout(timer);
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                usersMap.delete(message.author.id);
            }, 20000);
        }else{
            ++msgCount;
            if(parseInt(msgCount) === LIMIT){
                return;
            }else{
                userData.msgCount = msgCount;
                usersMap.set(message.author.id, userData);
            }
        }
    }else{
        let fn = setTimeout(() => { // Removendo a restrição por span
            usersMap.delete(message.author.id);
        }, 20000);
        usersMap.set(message.author.id, { 
            msgCount: 1,
            lastMessage: message,
            timer: fn
        });
    }

    if(msgCount < 7 && difference > 1700 || difference === 0){ // Limitando em um exp a cada 1.5 segundos e ignorando span
        if(rank_servidores.length > 0){
            for(let i = 0; i < rank_servidores.length; i++){

                let qtd_users = 0;
                let id_server = Object.keys(rank_servidores[i])[0];
                valores = [];
                
                for(let x = 0; x < rank_servidores[i][id_server].length; x++){ // Transfere todos os dados do JSON para um objeto javascript manipulável
                    let id_user = rank_servidores[i][id_server][x]["id_user"];
                    let user = rank_servidores[i][id_server][x]["user"];
                    let exp = rank_servidores[i][id_server][x]["exp"];
                
                    if(id_server === message.guild.id && id_user != message.author.id)
                        qtd_users += 1;

                    valores.push(constructJson2(id_user, user, exp));
                }
                
                if(qtd_users >= rank_servidores[i][id_server].length)
                    valores.push(constructJson2(message.author.id, message.author.username +"#"+ message.author.discriminator, 0));

                outputArray.push(
                    constructJson(id_server, valores)
                );
            }
        }else{ // Insere o primeiro valor no json ( nunca é usado, a menos que o json esteja zerado )
            valores.push(constructJson2(message.author.id, message.author.username +"#"+ message.author.discriminator, 0));

            outputArray.push(
                constructJson(message.guild.id, valores)
            );
        }
        
        valores = [];

        let x = 0;
        let qtd_users_2 = 0;

        for(let i = 0; i < outputArray.length; i++){ // Procura pelo ID do server e altera o idioma
            let obj = outputArray[i];
            let server = Object.keys(obj)[0];

            for(x = 0; x < obj[server].length; x++){
                if(obj[server][x]["id_user"] == message.author.id && server == message.guild.id) { // Atualiza o exp de um usuário se ele existir no json / for do mesmo servidor que mandou a mensagem
                    obj[server][x]["user"] = message.author.username +"#"+ message.author.discriminator;
                    obj[server][x]["exp"] = parseInt(obj[server][x]["exp"]) + 1;
                    qtd_users_2 += 1;
                    break;
                }

                if(qtd_users_2 > 0) // 2° Validação de que já foi alterado o dado de algum usuário
                    break;
                
                if(server === message.guild.id && obj[server][x]["id_user"] == message.author.id)
                    qtd_users_2 += 1;
            }
        }

        if(qtd_users_2 == 0){ // Adiciona um servidor novo / user novo
            valores.push(constructJson2(message.author.id, message.author.username +"#"+ message.author.discriminator, 0));

            outputArray.push(
                constructJson(message.guild.id, valores)
            );
        }

        // Formata o arquivo no formato aceito pelo bot
        let dados_ranking = JSON.stringify(outputArray, null, 4);
        dados_ranking = dados_ranking.replace("[", "");
        dados_ranking = dados_ranking.slice(0, -1);

        dados_ranking = "{ \"rank_servidores\" : [ " + dados_ranking + " ] }";

        dados_ranking = JSON.parse(dados_ranking); // Ajusta o arquivo
        dados_ranking = JSON.stringify(dados_ranking, null, 4);

        try{
            fs.writeFile('./arquivos/data/rank/ranking.json', dados_ranking, (err) => {
                if (err) throw err;
            });
        }catch(err){
            console.log("Erro ao salvar o arquivo de ranks");
            return;
        }

        // Limpa o cache para reiniciar os valores
        delete require.cache[require.resolve('../arquivos/data/rank/ranking.json')];
    }
}