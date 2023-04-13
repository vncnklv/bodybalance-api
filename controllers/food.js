const Food = require('../models/Food');

exports.getFoods = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 10;

    const foods = await Food.find({}).sort({ createdOn: 1 }).skip((page - 1) * count).limit(count);

    res.status(200).json({
        status: 'success',
        data: foods
    });
}

exports.getFood = async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (!food) {
        return res.status(404).json({
            status: 'failed',
            message: 'Food data not found.'
        });
    }

    res.status(200).json({
        status: 'success',
        data: food
    });
}

exports.addFood = async (req, res) => {
    const food = new Food(req.body);
    food.ownerId = req.user._id;

    try {
        await food.save();
        res.status(201).json({
            status: 'success',
            data: food
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.editFood = async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (!food) {
        return res.status(404).json({
            status: 'failed',
            message: 'Food data not found.'
        });
    }

    if (req.user.role != 'admin' && food.ownerId.toString() != req.user._id) {
        return res.status(401).json({
            status: 'failed',
            message: 'Not authorized'
        });
    }

    try {
        const updatedFood = Object.assign(food.toObject(), req.body);
        food.set(updatedFood);
        await food.save();

        res.status(200).json({
            status: 'success',
            data: food
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.deleteFood = async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (!food) {
        return res.status(404).json({
            status: 'failed',
            message: 'Food data not found.'
        });
    }

    if (req.user.role != 'admin' && food.ownerId.toString() != req.user._id) {
        return res.status(401).json({
            status: 'failed',
            message: 'Not authorized'
        });
    }
    try {
        await food.deleteOne();

        res.status(200).json({
            status: 'success',
            data: food
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }

}