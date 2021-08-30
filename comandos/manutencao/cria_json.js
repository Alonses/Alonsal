const faixas = require('../../arquivos/json/text/faixas.json');
const ytdl = require('ytdl-core');

module.exports = {
    name: "cria_json",
    description: "cria um json com os nomes das músicas",
    aliases: [ "jo" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        return;

        var fs = require("fs");
        var sampleObject = "\{";

        let alvos = ["musicas", "memes", "trilhas", "classicos"];

        for(var i = 0; i < 4; i++){
            for(var x = 0; x < faixas[alvos[i]].length; x++){

                titulo = await ytdl.getInfo(faixas[alvos[i]][x]).then(info => info.videoDetails.title);

                const fs = require('fs')
                const CreateFiles = fs.createWriteStream('./teste.json', {
                    flags: 'a' //flags: 'a' preserved old data
                })

                console.log(i, x, faixas[alvos[i]][x], titulo);

                sampleObject += "\{\"";
                sampleObject += faixas[alvos[i]][x];
                sampleObject += "\" \: \""
                sampleObject += titulo;
                sampleObject += "\"\},";

                CreateFiles.write(sampleObject +'\r\n')

                sampleObject = "";
            }
        }

        sampleObject += "\}";
        sampleObject = sampleObject.replace("\"", "");
        
        fs.writeFile("./teste.json", JSON.stringify(sampleObject, null, 4), (err) => {
            if(err){
                console.error(err);
                return;
            };

            console.log("File has been created");
        });
    }   
}