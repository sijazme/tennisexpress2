const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
    cc: String,
    country: String,
    id: Number,
    name: String,
    ranking: Number,
    rating: Number
});

const Player = mongoose.model("Player", PlayerSchema, "Player");

module.exports = { Player };