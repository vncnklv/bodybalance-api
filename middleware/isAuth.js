const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");
const { verifyToken } = require("../utilities");

exports.isAuth = async (req, res, next) => {
    const token = req.headers['x-authorization'];
    const userData = verifyToken(token);

    if (!userData) {
        res.status(401).json({
            status: "failed",
            message: "Expired token. Please login."
        })
        return
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token: token });
    if (blacklistedToken) {
        res.status(401).json({
            status: "failed",
            message: "Expired token. Please login."
        })
        return
    }

    const user = await User.findById(userData.userId).populate('weightIns').populate('trainer', 'name lastName _id');
    if (!user) {
        res.status(401).json({
            status: "failed",
            message: "Please login."
        })
        return
    }

    req.user = user;

    next();
}