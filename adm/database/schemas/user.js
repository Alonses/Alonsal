const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const schema = new mongoose.Schema({
    uid: ObjectId,
    lang: String,
    social: {
        steam: String,
        lastfm: String,
        pula_predios: String
    },
    misc: {
        color: String,
        money: Number,
        embed: String,
        locale: String
    },
    badges: {
        fixed_badge: String,
        badge_list: [{key: String, value: Number}]
    },
    conquistas: [String]
});

module.exports = mongoose.model("User", schema);