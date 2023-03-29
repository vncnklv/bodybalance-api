const { Schema, model } = require('mongoose')
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
    confirmPassword: {
        type: String,
        required: [true, "Password confirmation is required."],
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

userSchema.post('save', function(error, doc, next) {
    if (error.code === 11000) {
      next(new Error(Object.keys(error.keyValue)[0] + " already exists."));
    } else {
      next(error);
    }
  });

const User = model('User', userSchema);

module.exports = User;