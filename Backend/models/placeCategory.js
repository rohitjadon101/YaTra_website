const mongoose = require("mongoose");

const placeCategorySchema = mongoose.Schema({
    title1: { type: String, required: true },
    description: { type: String, required: true },
    img1: { type: String, required: true }
})

module.exports = mongoose.model('placeCategory', placeCategorySchema);