const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    profileImage: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
    },
    password: String,
    likedPlaces: [
        {type: mongoose.Schema.Types.ObjectId, ref: "place"}
    ],
    savedPlaces: [
        {type: mongoose.Schema.Types.ObjectId, ref: "place"}
    ]
})

module.exports = mongoose.model('user', userSchema);