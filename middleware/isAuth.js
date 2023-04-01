const User = require("../models/User");
const { verifyToken } = require("../utilities");

exports.isAuth = async (req, res, next) => {
    const token = req.headers['x-authorization'];
    const userId = verifyToken(token);

    if (!userId) {
        res.status(401).json({
            status: "failed",
            message: "Please login."
        })
        return
    }

    const user = await User.findById(userId);

    if(!user) {
        res.status(401).json({
            status: "failed",
            message: "Please login."
        })
        return
    }
    
    req.user = user; 

    next();
}