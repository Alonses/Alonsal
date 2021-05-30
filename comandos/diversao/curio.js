const curios = require('./curio.json');

module.exports = async ({ message }) => {

    var num = Math.round(110 * Math.random());

    num = num.toString();
    message.channel.send(":clipboard: "+ curios[num]);
}
