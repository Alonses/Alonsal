module.exports = async ({client, message, args}) => {

    return;
    // Testes ultra secretos, desveja

    const fetch = require('node-fetch');

    let url_completa = "https://www.epicgames.com/store/pt-BR/free-games";

    fetch(url_completa)
    .then(response => response.text())
    .then(async res => {        
        indices = res.split("<div class=\"css-13ku56z\">");

        console.log(indices[2]);
    });
}