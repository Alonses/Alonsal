module.exports = ({ client, data }) => {

    const horas = parseInt(data?.horas) || 0
    const minutos = parseInt(data?.minutos) || 0
    const segundos = parseInt(data?.segundos) || 0

    if (segundos) return `${(`0${horas}`).substr(-2)}:${(`0${minutos}`).substr(-2)}:${(`0${segundos}`).substr(-2)}`
    else if (minutos) return `${(`0${horas}`).substr(-2)}:${(`0${minutos}`).substr(-2)}`
    else return (`0${horas}`).substr(-2)
}