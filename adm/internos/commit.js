const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const fs = require('fs')
const { EmbedBuilder } = require('discord.js')

module.exports = async function({client}) {

    fetch('https://github.com/odnols/Alonsal/commits/main')
    .then(res => res.text())
    .then(retorno => {

        let nome_commit = retorno.split("<a class=\"Link--primary text-bold js-navigation-open markdown-title\"")[1].split("</a>")[0].split(">")[1]
        let id_commit = retorno.split("<a class=\"Link--primary text-bold js-navigation-open markdown-title\"")[1].split("\">")[0].split("commit/")[1]

        fs.readFile('./arquivos/data/commit.txt', 'utf8', function(err, data) {
        
            if (id_commit !== data) {
                
                const embed = new EmbedBuilder()
                .setTitle(nome_commit)
                .setURL(`https://github.com/odnols/Alonsal/commit/${id_commit}`)
                .setFooter({ text: id_commit.slice(0, 6) })

                client.channels.cache.get('1017819445986594846').send({ embeds: [embed] })

                fs.writeFile('./arquivos/data/commit.txt', id_commit.toString(), (err) => {
                    if (err) throw err
                })
            }
        })
    })
}