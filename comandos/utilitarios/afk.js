module.exports = async ({message, args, usuarios_inativos, requisicao_auto}) => {

    if(typeof requisicao_auto !== "undefined"){

        let content = message.content;
        let mensagem = "";
        let encontrado = false;

        let id_marcacao = content.replace("<@", "");
        id_marcacao = id_marcacao.replace(">", "");
        id_marcacao = id_marcacao.replace("!", "");

        for(const element of usuarios_inativos) {
            if(id_marcacao === element[0]){
                mensagem = element[1]

                encontrado = true;
                break;
            }
        }

        if(mensagem != "")
            mensagem = "Recado deixado: `"+ mensagem + "`";

        if(encontrado){
            message.channel.send(`${message.author} este usuário está afk no momento :ok_hand::point_left:\n`+ mensagem)
            .then(msg => {
                msg.delete({ timeout: 5000 });
            })
            return true
        }
        return false
    }

    let motivo = ""; 

    for(let i = 0; i < args.length; i++){
        motivo += args[i];

        if(typeof args[i + 1] !== "undefined")
            motivo += " ";
    }

    let user_afk = [message.author.id, motivo]
    usuarios_inativos.add(user_afk)

    message.channel.send(`${message.author} modo afk ligado\nAvisarei outros membros caso marquem você `)
    .then(msg => {
        msg.delete({ timeout: 5000 });
    })
}