const DailyWeight = require('../models/DailyWeight');
const { areEqualObjectIds } = require('../utilities');

exports.getWeights = (req, res) => {
    const user = req.user;
    res.status(200).json({
        status: "success",
        data: user.weightIns
    });
}

exports.getWeight = async (req, res) => {
    const user = req.user;
    const weightData = await DailyWeight.findById(req.params.id);

    if (!weightData) {
        return res.status(404).json({
            status: "failed",
            message: "Weight data not found!"
        });
    }

    if (!areEqualObjectIds(user._id, weightData.ownerId)) {
        return res.status(403).json({
            status: "failed",
            message: "You cannot access this data!"
        });
    }

    res.status(200).json({
        status: "success",
        data: weightData
    });
}


exports.addWeight = async (req, res) => {
    const user = req.user;
    const newWeight = Number(req.body.weight);
    const date = req.body.date ? new Date(req.body.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10);
    let newDailyWeight;

    try {
        newDailyWeight = new DailyWeight({
            date: date,
            weight: newWeight,
            ownerId: user._id
        });
        await newDailyWeight.save();
    } catch (err) {
        return res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }

    user.weightIns.push(newDailyWeight);

    await user.save();

    res.status(200).json({
        stauts: "success",
        data: user.weightIns
    });
}


exports.removeWeight = async (req, res) => {
    const user = req.user;
    const weightData = await DailyWeight.findById(req.params.id);

    if (!weightData) {
        return res.status(404).json({
            status: "failed",
            message: "Data for this weight not found."
        })
    }

    if (!areEqualObjectIds(user._id, weightData.ownerId)) {
        return res.status(403).json({
            status: "failed",
            message: "You cannot access this data!"
        });
    }

    const index = user.weightIns.findIndex(w => areEqualObjectIds(w._id, weightData._id));

    user.weightIns.splice(index, 1);
    await user.save();
    await weightData.deleteOne();

    res.status(200).json({
        status: "success",
        data: weightData
    })
}

exports.editWeight = async (req, res) => {
    const user = req.user;
    const weightData = await DailyWeight.findById(req.params.id);

    if (!weightData) {
        return res.status(404).json({
            status: "failed",
            message: "Data for this weight not found."
        })
    }

    if (!areEqualObjectIds(user._id, weightData.ownerId)) {
        return res.status(403).json({
            status: "failed",
            message: "You cannot access this data!"
        });
    }

    const newWeight = Number(req.body.weight);

    if (!newWeight) {
        return res.status(400).json({
            status: "failed",
            message: "Weight is not a number"
        })
    }

    weightData.weight = newWeight;
    await weightData.save();

    res.status(200).json({
        status: "success",
        data: weightData
    });
}