const mongoose = require("mongoose");

function setup(uri) {
    mongoose.connect(uri);
    var database = mongoose.connection;
}

module.exports = {
    setup
}