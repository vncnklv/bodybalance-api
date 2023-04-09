const { Schema, Types: { ObjectId } } = require('mongoose');
const micronutrientsSchema = require('./micronutrients');

const foodSchema = new Schema({
    food: {
        type: ObjectId,
        ref: 'Food',
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false });

const mealSchema = new Schema({
    calories: {
        type: Number,
        default: 0
    },
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
    foods: {
        type: [foodSchema],
        default: []
    }
}, { _id: false });

mealSchema.pre('save', async function (next) {
    // calculate macronutrients if foods are changed
    if (this.isModified('foods')) {
        await this.populate('foods.food');

        this.protein = this.foods.reduce((acc, food) => acc + food.food.protein * food.quantity, 0);
        this.carbohydrates = this.foods.reduce((acc, food) => acc + food.food.carbohydrates * food.quantity, 0);
        this.fats = this.foods.reduce((acc, food) => acc + food.food.fats * food.quantity, 0);
        this.calories = this.foods.reduce((acc, food) => acc + food.food.calories * food.quantity, 0);
        this.fiber = this.foods.reduce((acc, food) => acc + food.food.fiber * food.quantity, 0);
        this.cholesterol = this.foods.reduce((acc, food) => acc + food.food.cholesterol * food.quantity, 0);

        // calculate micronutrients
        this.micronutrients = this.foods.reduce((acc, food) => {
            Object.keys(food.food.micronutrients).forEach(key => {
                acc[key] = acc[key] ? acc[key] + food.food.micronutrients[key] * food.quantity : food.food.micronutrients[key] * food.quantity;
            });
            return acc;
        }, {});
    }

    next();
});

module.exports = mealSchema;