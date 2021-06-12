module.exports = async({message}) => {
    const dado = 1 + Math.round(5 * Math.random());

    message.channel.send(`:game_die: ${message.author}`+ ', O dado caiu no [ `'+ dado +'` ]');
}
