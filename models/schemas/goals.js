const { Schema } = require('mongoose');
const micronutrientsSchema = require('./micronutrients');

const goalsSchema = new Schema({
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
    }
}, { _id: false });

module.exports = goalsSchema;

