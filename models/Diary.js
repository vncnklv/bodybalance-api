const { Schema, model, Types: { ObjectId } } = require('mongoose');
const micronutrientsSchema = require('./schemas/micronutrients');
const mealSchema = require('./schemas/meal');

const diarySchema = new Schema({
    protein: {
        type: Number,
        default: 0
    },
    carbohydrates: {
        type: Number,
        default: 0
    },
    fats: {
        type: Number,
        default: 0
    },
    calories: {
        type: Number,
        default: 0
    },
    fiber: {
        type: Number,
        default: 0
    },
    cholesterol: {
        type: Number,
        default: 0
    },
    macronutrients: {
        type: micronutrientsSchema,
    },
    breakfast: {
        type: mealSchema,
        default: {}
    },
    lunch: {
        type: mealSchema,
        default: {}
    },
    dinner: {
        type: mealSchema,
        default: {}
    },
    snacks: {
        type: mealSchema,
        default: {}
    },
    date: {
        type: String,
        required: [true, 'Date is missing.'],
    },
    ownerId: {
        type: ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

diarySchema.index({ date: 1, ownerId: 1 }, { unique: true });

diarySchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        next(new Error(Object.keys(error.keyValue)[0] + " is already in use."));
    } else if (error.name === "ValidationError") {
        next(new Error(Object.values(error.errors).map(val => val.message)));
    } else {
        next(error);
    }
});

diarySchema.pre('save', async function (next) {
    // calculate macronutrients if meals are changed
    if (this.isModified('breakfast') || this.isModified('lunch') || this.isModified('dinner') || this.isModified('snacks')) {
        this.protein = this.breakfast.protein + this.lunch.protein + this.dinner.protein + this.snacks.protein;
        this.carbohydrates = this.breakfast.carbohydrates + this.lunch.carbohydrates + this.dinner.carbohydrates + this.snacks.carbohydrates;
        this.fats = this.breakfast.fats + this.lunch.fats + this.dinner.fats + this.snacks.fats;
        this.calories = this.breakfast.calories + this.lunch.calories + this.dinner.calories + this.snacks.calories;
        this.fiber = this.breakfast.fiber + this.lunch.fiber + this.dinner.fiber + this.snacks.fiber;
        this.cholesterol = this.breakfast.cholesterol + this.lunch.cholesterol + this.dinner.cholesterol + this.snacks.cholesterol;

        // calculate micronutrients if there are any presented in any of the meals in the diary
        this.micronutrients = calculateMicronutrients(this.micronutrients, this.breakfast.micronutrients);
        this.micronutrients = calculateMicronutrients(this.micronutrients, this.lunch.micronutrients);
        this.micronutrients = calculateMicronutrients(this.micronutrients, this.dinner.micronutrients);
        this.micronutrients = calculateMicronutrients(this.micronutrients, this.snacks.micronutrients);
    }
    next();
});

const calculateMicronutrients = (micronutrients, micronutrientsToAdd) => {
    if (micronutrientsToAdd) {
        Object.keys(micronutrientsToAdd).forEach(key => {
            if (!micronutrients[key]) micronutrients[key] = 0;
            micronutrients[key] += micronutrientsToAdd[key];
        });
    }
    return micronutrients;
};

const Diary = model('diary', diarySchema);

module.exports = Diary;