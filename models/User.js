const { Schema, model, Types: { ObjectId } } = require('mongoose')
const { isEmail } = require('validator');
const { hash } = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        min: [3, "Username must be atlast 3 characters long."],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        validator: [isEmail, "Email is not valid."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [8, "Password must be minimum 8 characters long."]
    },
    role:{
        type: String,
    },
    weightIns: {
        type: [ObjectId],
        ref: 'DailyWeight',
        "default": []
    },
}, { timestamps: true });

userSchema.virtual('confirmPassword').set(function (value) {
    if (this.password !== value) {
        throw new Error('Repeat password should match password');
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await hash(this.password, 12);

    next();
});

userSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        next(new Error(Object.keys(error.keyValue)[0] + " is already in use."));
    } else if (error.name === "ValidationError") {
        next(new Error(Object.values(error.errors).map(val => val.message)));
    } else {
        next(error);
    }
});

const User = model('User', userSchema);

module.exports = User;