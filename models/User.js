const { Schema, model, Types: { ObjectId } } = require('mongoose')
const { isEmail } = require('validator');
const goalsSchema = require('./schemas/goals');
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
    role: {
        type: String,
        enum: { values: ['user', 'admin', 'trainer'], message: "Role is not valid." },
        default: 'user'
    },
    goals: {
        type: goalsSchema,
        default: {}
    },
    weightIns: {
        type: [ObjectId],
        ref: 'dailyWeight',
        default: []
    },
    diaries: {
        type: [ObjectId],
        ref: 'diary',
        default: []
    },
    age: {
        type: Number,
        min: [0, "Age cannot be less than zero."]
    },
    gender: {
        type: String,
        enum: { values: ['male', 'female'], message: "Gender is not valid." }
    },
    height: {
        type: Number,
        min: [0, "Height cannot be less than zero."]
    },
    goal: {
        type: String,
        enum: { values: ['lose weight', 'gain weight', 'maintain weight'], message: "Goal is not valid." }
    },
    activityLevel: {
        type: String,
        enum: { values: ['sedentary', 'lightly active', 'moderately active', 'active', 'very active'], message: "Activity level is not valid." }
    },
    currentWeight: {
        type: Number,
        min: [0, "Weight cannot be less than zero."]
    },
    name: {
        type: String,
        minlength: [2, "Name must be minimum 2 characters long."],
        required: [true, "Name is required."]
    },
    lastName: {
        type: String,
        minlength: [2, "Lastname must be minimum 2 characters long."],
        required: [true, "Lastname is required."]
    },
    trainer: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    clients: {
        type: [ObjectId],
        ref: 'User',
        default: []
    }
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