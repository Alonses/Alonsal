const curios = require('./curio.json');

module.exports = async ({ message }) => {

    var num = 1 + Math.round(109 * Math.random());

    num = num.toString();
    message.channel.send(":clipboard: "+ curios[num]);
}
