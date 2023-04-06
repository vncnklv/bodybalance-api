const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utilities");

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