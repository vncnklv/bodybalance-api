const { verifyToken } = require("../utilities");

exports.isAuth = (req, res, next) => {
    const token = req.headers['x-authorization'];
    const userId = verifyToken(token);

    if (!userId) {
        res.status(401).json({
            status: "unauthorized",
            message: "Please login."
        })
        return
    }

    req.userId = userId;

    next();
}