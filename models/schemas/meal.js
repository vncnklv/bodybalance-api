const { Schema, Types: { ObjectId } } = require('mongoose');
const micronutrientsSchema = require('./micronutrients');

const foodSchema = new Schema({
    food: {
        type: ObjectId,
        ref: 'food',
    },
    quantity: {
        type: Number,
        default: 1
    }
});

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
});

module.exports = mealSchema;