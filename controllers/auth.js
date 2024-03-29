const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../utilities");

exports.signIn = async (req, res) => {
    const user = await User.findOne({ username: new RegExp(`^${req.body.username}$`, 'i') });

    let passwordsMatch = false;
    if (user) passwordsMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordsMatch) {
        res.status(200).json({
            status: "success",
            data: {
                username: user.username,
                token: generateToken({ userId: user._id })
            }
        });
    } else {
        res.status(401).json({
            status: "failed",
            message: "Wrong username or password"
        })
    }
}

exports.signUp = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            name: req.body.name,
            lastName: req.body.lastName,
            role: 'user'
        });

        await user.save();

        res.status(201).json({
            status: "success",
            data: {
                username: user.username,
                token: generateToken({ userId: user._id })
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.logout = async (req, res) => {
    const token = req.headers['x-authorization'];
    const data = verifyToken(token);
    const blacklistedToken = new BlacklistedToken({
        token: token,
        expiresAt: data.exp * 1000,
    });

    try {
        await blacklistedToken.save();
        res.status(200).json({
            status: "success",
            message: "Logged out"
        });

    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }

}
