const { Schema, model, Types: { ObjectId } } = require('mongoose');
const { schema } = require('./User');

const dailyWeightSchema = new Schema({
    date: {
        type: String,
        required: [true, "Date is required"],
    },
    weight: {
        type: Number,
        required: [true, "Weight is required"],
    },
    ownerId: {
        type: ObjectId,
        ref: 'User'
    }
});

dailyWeightSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        next(new Error(`There is already data for this day.`));
    } else if (error.name === "ValidationError") {
        next(new Error(Object.values(error.errors).map(val => val.message)));
    } else {
        next(error);
    }
});

dailyWeightSchema.index({ date: 1, ownerId: 1 }, { unique: true });

const DailyWeight = model('DailyWeight', dailyWeightSchema);

module.exports = DailyWeight;
