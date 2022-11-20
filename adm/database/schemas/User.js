const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    uid: String,
    lang: {type: String, default: "pt-br"},
    social: {
        steam: {type: String, default: ""},
        lastfm: {type: String, default: ""},
        pula_predios: {type: String, default: ""}
    },
    misc: {
        color: {type: String, default: "#29BB8E"},
        daily: String,
        money: {type: Number, default: 0},
        embed: {type: String, default: "#29BB8E"},
        locale: {type: String, default: "brasil"}
    },
    badges: {
        fixed_badge: String,
        badge_list: [{key: String, value: Number}]
    },
    conquistas: [{key: String, value: Number}]
});

const model = mongoose.model("User", schema);

async function getUser(uid) {
    if (!await model.exists({uid: uid})) await model.create({ uid: uid, });

    return model.findOne({uid: uid});
}

module.exports.User = model;
module.exports.getUser = getUser;