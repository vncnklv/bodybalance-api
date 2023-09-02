const Diary = require("../models/Diary");
const Food = require("../models/Food");

exports.getAllDiariesForCurrentUser = async (req, res) => {
    try {
        const diaries = await Diary.find({ ownerId: req.user._id })
            .populate(['breakfast.foods.food', 'lunch.foods.food', 'dinner.foods.food', 'snacks.foods.food']);

        res.status(200).json({
            status: 'success',
            data: diaries
        });
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err.message
        });
    }
};

exports.addDiary = async (req, res) => {
    const diary = new Diary({
        date: req.body.date || new Date().toISOString().substring(0, 10),
        ownerId: req.user._id
    });

    try {
        await diary.save();
        req.user.diaries.push(diary);
        await req.user.save();
        res.status(201).json({
            status: 'success',
            data: diary
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.getDiary = async (req, res) => {
    try {
        const diary = await Diary.findById(req.params.id)
            .populate(['breakfast.foods.food', 'lunch.foods.food', 'dinner.foods.food', 'snacks.foods.food']);

        if (!diary) throw new Error('Diary not found');
        if (diary.ownerId.toString() !== req.user._id.toString()) throw new Error('You are not authorized to view this diary');

        res.status(200).json({
            status: 'success',
            data: diary
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.getTodaysDiary = async (req, res) => {
    const date = req.query.date || new Date().toISOString().substring(0, 10);

    try {
        const diary = await Diary.findOne({ ownerId: req.user._id, date })
            .populate(['breakfast.foods.food', 'lunch.foods.food', 'dinner.foods.food', 'snacks.foods.food']);

        
        if (!diary) {
            const newDiary = new Diary({
                date,
                ownerId: req.user._id
            });
            await newDiary.save();
            req.user.diaries.push(newDiary);
            await req.user.save();
            return res.status(200).json({
                status: 'success',
                data: newDiary
            });
        }

        if (diary.ownerId.toString() !== req.user._id.toString()) throw new Error('You are not authorized to view this diary');

        res.status(200).json({
            status: 'success',
            data: diary
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.addFoodToDiary = async (req, res) => {
    const diaryId = req.params.id;
    let { meal, foodId, quantity } = req.body;
    quantity = Number(quantity);

    try {
        const diary = await Diary.findById(diaryId);
        if (!diary) throw new Error('Diary not found');
        if (diary.ownerId.toString() !== req.user._id.toString()) throw new Error('You are not authorized to view this diary');

        if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(meal)) throw new Error('Invalid meal');
        if (!quantity) throw new Error('Quantity is required');
        if (quantity < 0) throw new Error('Quantity cannot be negative');
        if (!foodId) throw new Error('Food is required');

        const food = await Food.findById(foodId);
        if (!food) throw new Error('Food not found');


        diary[meal].foods.push({ food: foodId, quantity });
        await diary.save();

        diary.populate(['breakfast.foods.food', 'lunch.foods.food', 'dinner.foods.food', 'snacks.foods.food']);

        res.status(200).json({
            status: 'success',
            data: diary
        });

    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.removeFoodFromDiary = async (req, res) => {
    const { id, foodId, meal } = req.params;
    try {
        const diary = await Diary.findById(id);
        if (!diary) throw new Error('Diary not found');
        if (diary.ownerId.toString() !== req.user._id.toString()) throw new Error('You are not authorized to edit this diary');
        if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(meal)) throw new Error('Invalid meal');

        const food = diary[meal].foods.find(f => f._id.toString() === foodId);
        if (!food) throw new Error('Food not found');

        diary[meal].foods.pull(foodId);
        await diary.save();

        await diary.populate(['breakfast.foods.food', 'lunch.foods.food', 'dinner.foods.food', 'snacks.foods.food']);

        res.status(200).json({
            status: 'success',
            data: diary
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.updateFoodInDiary = async (req, res) => {
    const { id, foodId, meal } = req.params;
    const { quantity: newQuantity, meal: newMeal } = req.body;

    try {
        const diary = await Diary.findById(id);
        if (!diary) throw new Error('Diary not found');
        if (diary.ownerId.toString() !== req.user._id.toString()) throw new Error('You are not authorized to view this diary');

        if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(meal)) throw new Error('Invalid meal');

        const food = diary[meal].foods.find(f => f._id.toString() === foodId);
        if (!food) throw new Error('Food not found');

        if (newQuantity && food.quantity != newQuantity)
            food.quantity = newQuantity;

        if (newMeal && meal != newMeal) {
            diary[meal].foods.pull(foodId);
            diary[newMeal].foods.push({ food: food.food._id, quantity: newQuantity || food.quantity })
        }

        await diary.save();

        await diary.populate(['breakfast.foods.food', 'lunch.foods.food', 'dinner.foods.food', 'snacks.foods.food']);

        res.status(200).json({
            status: 'success',
            data: diary
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

