const { Schema, model } = require('mongoose')
const { isEmail } = require('validator');
const { hash } = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: [3, "Username must be atlast 3 characters long."],
        unique: [true, "Username is already taken."]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator: [isEmail, "Email is not valid."]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be minimum 8 characters long."]
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords doesn't match."
        }
    }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if(this.password !== this.confirmPassword) return;

    this.password = await hash(this.password, 12);

    this.confirmPassword = undefined;

    next();
});

const User = model('User', userSchema);

module.exports = User;