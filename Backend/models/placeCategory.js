const mongoose = require("mongoose");

const placeCategorySchema = mongoose.Schema({
    title1: String,
    description: String,
    img1: String
})

module.exports = mongoose.model('placeCategory', placeCategorySchema);