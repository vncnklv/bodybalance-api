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
    micronutrients: {
        type: micronutrientsSchema,
        default: {}
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
    if (this.isModified('breakfast') || this.isModified('lunch') || this.isModified('dinner') || this.isModified('snacks')) {
        await this.populate(
            [
                {
                    path: 'breakfast.foods',
                    populate: {
                        path: 'food',
                    },
                },
                {
                    path: 'lunch.foods',
                    populate: {
                        path: 'food',
                    },
                },
                {
                    path: 'dinner.foods',
                    populate: {
                        path: 'food',
                    },
                },
                {
                    path: 'snacks.foods',
                    populate: {
                        path: 'food',
                    },
                },
            ]);

        calculateMealNutrients(this.breakfast);
        calculateMealNutrients(this.lunch);
        calculateMealNutrients(this.dinner);
        calculateMealNutrients(this.snacks);

        this.protein = this.breakfast.protein + this.lunch.protein + this.dinner.protein + this.snacks.protein;
        this.carbohydrates = this.breakfast.carbohydrates + this.lunch.carbohydrates + this.dinner.carbohydrates + this.snacks.carbohydrates;
        this.fats = this.breakfast.fats + this.lunch.fats + this.dinner.fats + this.snacks.fats;
        this.calories = this.breakfast.calories + this.lunch.calories + this.dinner.calories + this.snacks.calories;
        this.fiber = this.breakfast.fiber + this.lunch.fiber + this.dinner.fiber + this.snacks.fiber;
        this.cholesterol = this.breakfast.cholesterol + this.lunch.cholesterol + this.dinner.cholesterol + this.snacks.cholesterol;


        // calculate micronutrients if there are any presented in any of the meals in the diary

        calculateMicronutrients(this.micronutrients, this.breakfast.micronutrients);
        calculateMicronutrients(this.micronutrients, this.lunch.micronutrients);
        calculateMicronutrients(this.micronutrients, this.dinner.micronutrients);
        calculateMicronutrients(this.micronutrients, this.snacks.micronutrients);

    }
    next();
});

const calculateMealNutrients = (meal) => {
    if(meal.foods.length === 0) {
        meal.protein = 0;
        meal.carbohydrates = 0;
        meal.fats = 0;
        meal.calories = 0;
        meal.fiber = 0;
        meal.cholesterol = 0;
        meal.micronutrients = {};
        return;
    }

    let protein = 0;
    let carbohydrates = 0;
    let fats = 0;
    let calories = 0;
    let fiber = 0;
    let cholesterol = 0;
    let micronutrients = {};

    meal.foods.forEach(food => {
        protein += food.food.protein * food.quantity;
        carbohydrates += food.food.carbohydrates * food.quantity;
        fats += food.food.fats * food.quantity;
        calories += food.food.calories * food.quantity;
        fiber += food.food.fiber * food.quantity;
        cholesterol += food.food.cholesterol * food.quantity;
        calculateMicronutrients(micronutrients, food.food.micronutrients, food.quantity);
    });

    meal.protein = protein;
    meal.carbohydrates = carbohydrates;
    meal.fats = fats;
    meal.calories = calories;
    meal.fiber = fiber;
    meal.cholesterol = cholesterol;
    meal.micronutrients = micronutrients;
};

const calculateMicronutrients = (micronutrients, micronutrientsToAdd, quantity = 1) => {
    if (micronutrientsToAdd) {
        Object.keys(micronutrientsToAdd.toObject()).forEach(key => {
            if (!micronutrients[key]) micronutrients[key] = 0;
            micronutrients[key] += micronutrientsToAdd[key] * quantity;
        });
    }
    return micronutrients;
};

const Diary = model('diary', diarySchema);

module.exports = Diary;