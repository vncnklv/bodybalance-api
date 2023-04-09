const { Schema } = require('mongoose');

const micronutrientsSchema = new Schema({
    calcium: Number,
    sulfur: Number,
    phosphorus: Number,
    magnesium: Number,
    sodium: Number,
    potassium: Number,
    iron: Number,
    zinc: Number,
    boron: Number,
    copper: Number,
    chromium: Number,
    selenium: Number,
    manganese: Number,
    molybdenum: Number,
    cobalt: Number,
    fluorine: Number,
    iodine: Number,
    vitamin_a: Number,
    vitamin_c: Number,
    vitamin_d: Number,
    vitamin_e: Number,
    vitamin_k: Number,
    carotenoids: Number
}, { _id: false });

micronutrientsSchema.pre('save', function (next) {
    for (const m in this) {
        if (this[m] && this[m] < 0) throw new Error(`${m} can't be less than 0`)
    }

    next();
});

module.exports = micronutrientsSchema;