const mongoose = require("mongoose");

const addPlaceSchema = new mongoose.Schema({
    title1: String,
    title2: String,
    img1: String,
    content: String,
    category: String,
    userInfo: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    status: {type: String, default: "Pending"},
})

module.exports = mongoose.model('addedPlace', addPlaceSchema);