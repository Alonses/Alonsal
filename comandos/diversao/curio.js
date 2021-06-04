const curios = require('./curio.json')
const atach = require('./curio_atach.json')

module.exports = async ({ message }) => {

    var num = 1 + Math.round(138 * Math.random())
    
    message.channel.send(":clipboard: "+ curios[num])
    
    if(atach[num])
        message.channel.send(atach[num])
}
