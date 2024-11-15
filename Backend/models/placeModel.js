const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    title1: String,
    title2: String,
    img1: String,
    content: String,
    category: String,
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "user"}
    ],
    comments: [{profileImage: String, username: String, comment: String}]
});

module.exports = mongoose.model('place', placeSchema);