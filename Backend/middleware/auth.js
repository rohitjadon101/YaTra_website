const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
    const token = req.header("Authorization")?.split(' ')[1];

    if(!token) return res.json({message: "No token, Authorization denied"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.json({message: "Token is not valid"});
    }
}

module.exports = auth;