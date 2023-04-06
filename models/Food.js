const { Schema, model, Types: { ObjectId } } = require('mongoose')

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

const foodSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Food name is missing.'],
        unique: true
    },
    calories: {
        type: Number,
        required: [true, 'Calories value is missing.'],
        min: [0, 'Calories cannot be less than zero.']
    },
    carbohydrates: {
        type: Number,
        required: [true, 'Carbohydrates value is missing.'],
        min: [0, 'Carbohydrates cannot be less than zero.']
    },
    protein: {
        type: Number,
        required: [true, 'Protein value is missing.'],
        min: [0, 'Protein cannot be less than zero.']
    },
    fats: {
        type: Number,
        required: [true, 'Fats value is missing.'],
        min: [0, 'Fats cannot be less than zero.']
    },
    fiber: {
        type: Number,
        min: [0, 'Fats cannot be less than zero.']
    },
    cholesterol: {
        type: Number,
        min: [0, 'cholesterol cannot be less than zero.']
    },
    micronutrients: {
        type: micronutrientsSchema
    },
    ownerId: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

foodSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        next(new Error(`There is already data for food.`));
    } else if (error.name === "ValidationError") {
        next(new Error(Object.values(error.errors).map(val => val.message)));
    } else {
        next(error);
    }
});

const Food = model('food', foodSchema);

module.exports = Food;