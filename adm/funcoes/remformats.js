module.exports = (texto_entrada) => {
    
    const marcacoes = ["&quot;", "<br />", "<br>", "<p>", "<div>", "</div>", "<br "]

    for(let i = 0; i < marcacoes.length; i++){
        texto_entrada = texto_entrada.replaceAll(`${marcacoes[i]}`, "");
    }

    if(texto_entrada.length > 2000)
        texto_entrada = `${texto_entrada.slice(0, 2000)}...`;

    return texto_entrada;
}