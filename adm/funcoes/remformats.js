module.exports = (texto_entrada) => {
    
    texto_entrada = texto_entrada.replaceAll("&quot;", "");

    if(texto_entrada.length > 2000)
        texto_entrada = `${texto_entrada.slice(0, 2000)}...`;

    return texto_entrada;
}