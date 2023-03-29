const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utilities");

const signIn = async (req, res) => {
    const user = await User.findOne({ username: new RegExp(`^${req.body.username}$`, 'i') });

    let passwordsMatch = false;
    if (user) passwordsMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordsMatch) {
        res.status(200).json({
            status: "success",
            data: {
                username: user.username,
                token: generateToken(user)
            }
        });
    } else {
        res.status(401).json({
            status: "failed",
            message: "Wrong username or password"
        })
    }
}

const signUp = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        await user.save();

        res.status(201).json({
            status: "success",
            data: {
                username: user.username,
                token: generateToken(user)
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

module.exports = { signIn, signUp };