module.exports = (horas, minutos, segundos) => {

    if(minutos)
        return `${(`0${horas}`).substr(-2)}:${(`0${minutos}`).substr(-2)}`
    else if(segundos)
        return `${(`0${horas}`).substr(-2)}:${(`0${minutos}`).substr(-2)}:${(`0${segundos}`).substr(-2)}`
    else
        return (`0${horas}`).substr(-2)
}