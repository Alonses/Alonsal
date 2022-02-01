const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    name: "lista_dias",
    description: "Veja seu resumo do dia",
    aliases: [ "ltr" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const prefix = client.prefixManager.getPrefix(message.guild.id);
        let arquivos = await listarArquivosDoDiretorio(`./arquivos/data/trabalho/${message.author.id}`);
        const { trabalho } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        let data_formatada;

        if(arquivos.length == 0) return message.reply(`:mag: | ${trabalho[2]["sem_dados"]}`);

        for(let i = 0; i < arquivos.length; i++){
            
            data_formatada = arquivos[i].split("/")[5];
            data_formatada = data_formatada.replace(".json", "");
            data_formatada = `${data_formatada.slice(6, 8)}/${data_formatada.slice(4, 6)}/${data_formatada.slice(0, 4)}`;

            arquivos[i] = data_formatada;
        }


        const embed = new MessageEmbed()
        .setTitle(`:coffee: ${trabalho[2]["registrado"]} ( ${arquivos.length} )`)
        .setColor(0xfaa81a)
        .setDescription(`\`\`\`fix\n- ${arquivos.join("\n- ")}\`\`\``)
        .setFooter(`${trabalho[2]["dica_comando"].replace("data_repl", data_formatada).replace(".a", prefix)}`)

        await client.users.cache.get(message.author.id).send({ embeds: [embed] });
        message.delete();
    }
}

async function listarArquivosDoDiretorio(diretorio, arquivos) {

    if(!arquivos)
        arquivos = [];

    let listaDeArquivos = await fs.readdir(diretorio);
    for(let k in listaDeArquivos) {
        let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
        if(stat.isDirectory())
            await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
        else
            arquivos.push(diretorio + '/' + listaDeArquivos[k]);
    }

    return arquivos;
}