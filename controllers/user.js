const calculateCaloriesAndNutrients = require("../goal");
const User = require("../models/User");

exports.updateUserData = async (req, res) => {
    const { username, email, age, name, lastName, height, gender, goal, activityLevel, weight } = req.body;
    const user = req.user;

    if (username) user.username = username;
    if (email) user.email = email;
    if (age) user.age = age;
    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (height) user.height = height;
    if (gender) user.gender = gender;
    if (goal) user.goal = goal;
    if (activityLevel) user.activityLevel = activityLevel;
    if (weight) user.currentWeight = weight;

    try {
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                username: user.username,
                email: user.email,
                role: user.role,
                age: user.age,
                name: user.name,
                lastName: user.lastName,
                height: user.height,
                gender: user.gender,
                goal: user.goal,
                activityLevel: user.activityLevel,
                currentWeight: req.user.currentWeight,
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

exports.getUserData = (req, res) => {
    userData = {
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        age: req.user.age,
        name: req.user.name,
        lastName: req.user.lastName,
        height: req.user.height,
        gender: req.user.gender,
        goal: req.user.goal,
        activityLevel: req.user.activityLevel,
        currentWeight: req.user.currentWeight,
        trainer: req.user.trainer
    }

    res.status(200).json({
        status: 'success',
        data: userData
    });
}

exports.getUserGoals = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: req.user.goals
    });
}

exports.setUserGoals = async (req, res) => {
    const { calories, protein, carbohydrates, fats, cholesterol, fiber, micronutrients } = req.body;
    const goals = {
        calories: Number(calories),
        protein: Number(protein),
        carbohydrates: Number(carbohydrates),
        fats: Number(fats),
        cholesterol: cholesterol ? Number(cholesterol) : 0.3,
        fiber: fiber ? Number(fiber) : 25,
        micronutrients: {
            calcium: micronutrients && micronutrients.calcium ? Number(micronutrients.calcium) : 0.8,
            sulfur: micronutrients && micronutrients.sulfur ? Number(micronutrients.sulfur) : 1.3,
            phosphorus: micronutrients && micronutrients.phosphorus ? Number(micronutrients.phosphorus) : 0.7,
            magnesium: micronutrients && micronutrients.magnesium ? Number(micronutrients.magnesium) : 0.4,
            sodium: micronutrients && micronutrients.sodium ? Number(micronutrients.sodium) : 1.5,
            potassium: micronutrients && micronutrients.potassium ? Number(micronutrients.potassium) : 4.7,
            iron: micronutrients && micronutrients.iron ? Number(micronutrients.iron) : 8,
            zinc: micronutrients && micronutrients.zinc ? Number(micronutrients.zinc) : 11,
            boron: micronutrients && micronutrients.boron ? Number(micronutrients.boron) : 1.5,
            copper: micronutrients && micronutrients.copper ? Number(micronutrients.copper) : 0.9,
            chromium: micronutrients && micronutrients.chromium ? Number(micronutrients.chromium) : 35,
            selenium: micronutrients && micronutrients.selenium ? Number(micronutrients.selenium) : 55,
            manganese: micronutrients && micronutrients.manganese ? Number(micronutrients.manganese) : 2.3,
            molybdenum: micronutrients && micronutrients.molybdenum ? Number(micronutrients.molybdenum) : 45,
            cobalt: micronutrients && micronutrients.cobalt ? Number(micronutrients.cobalt) : 0.05,
            fluorine: micronutrients && micronutrients.fluorine ? Number(micronutrients.fluorine) : 4,
            iodine: micronutrients && micronutrients.iodine ? Number(micronutrients.iodine) : 150,
            vitaminA: micronutrients && micronutrients.vitaminA ? Number(micronutrients.vitaminA) : 900,
            vitaminC: micronutrients && micronutrients.vitaminC ? Number(micronutrients.vitaminC) : 90,
            vitaminD: micronutrients && micronutrients.vitaminD ? Number(micronutrients.vitaminD) : 15,
            vitaminE: micronutrients && micronutrients.vitaminE ? Number(micronutrients.vitaminE) : 15,
            vitaminK: micronutrients && micronutrients.vitaminK ? Number(micronutrients.vitaminK) : 120,
            carotenoids: micronutrients && micronutrients.carotenoids ? Number(micronutrients.carotenoids) : 6,
            niacin: micronutrients && micronutrients.niacin ? Number(micronutrients.niacin) : 16,
            vitaminB6: micronutrients && micronutrients.vitaminB6 ? Number(micronutrients.vitaminB6) : 1.3,
            vitaminB12: micronutrients && micronutrients.vitaminB12 ? Number(micronutrients.vitaminB12) : 2.4,
            folate: micronutrients && micronutrients.folate ? Number(micronutrients.folate) : 400,
            pantothenicAcid: micronutrients && micronutrients.pantothenicAcid ? Number(micronutrients.pantothenicAcid) : 5
        }
    };

    try {
        req.user.goals = goals;
        await req.user.save();
        res.status(200).json({
            status: 'success',
            data: req.user.goals
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.updateUserGoals = async (req, res) => {
    const { calories, protein, carbohydrates, fats, cholesterol, fiber, micronutrients } = req.body;

    if (req.user.goals.calories == 0) {
        res.status(400).json({
            status: 'failed',
            message: 'User goals are not set.'
        });
    }

    Object.assign(req.user.goals, {
        calories: calories ? Number(calories) : req.user.goals.calories,
        protein: protein ? Number(protein) : req.user.goals.protein,
        carbohydrates: carbohydrates ? Number(carbohydrates) : req.user.goals.carbohydrates,
        fats: fats ? Number(fats) : req.user.goals.fats,
        cholesterol: cholesterol ? Number(cholesterol) : req.user.goals.cholesterol,
        fiber: fiber ? Number(fiber) : req.user.goals.fiber
    });

    if (micronutrients) {
        for (const [key, value] of Object.entries(micronutrients)) {
            req.user.goals.micronutrients[key] = Number(value);
        }
    }

    try {
        await req.user.save();
        res.status(200).json({
            status: 'success',
            data: req.user.goals
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.setUserGoal = async (req, res) => {
    const { goal, activityLevel, weight } = req.body;
    const user = req.user;

    user.goal = goal;
    user.activityLevel = activityLevel;
    user.currentWeight = weight;

    try {
        await user.save();

        const goals = calculateCaloriesAndNutrients(user);

        user.goals = goals;
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                goal: user.goal,
                activityLevel: user.activityLevel,
                currentWeight: user.currentWeight,
                goals: user.goals
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.hireTrainer = async (req, res) => {
    const { trainerId } = req.body;
    const trainee = req.user;

    const trainer = await User.findById(trainerId);

    if (!trainer) {
        res.status(400).json({
            status: 'failed',
            message: 'Trainer not found.'
        });
    }

    if (trainer.role != 'trainer') {
        res.status(400).json({
            status: 'failed',
            message: 'User is not a trainer.'
        });
    }

    if (trainee.trainer) {
        res.status(400).json({
            status: 'failed',
            message: 'You already have a trainer.'
        });
    }

    trainee.trainer = trainer._id;

    try {
        await trainee.save();
        trainer.clients.push(trainee._id);
        await trainer.save();

        res.status(200).json({
            status: 'success',
            data: {
                trainer: trainee.trainer
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.unhireTraner = async (req, res) => {
    const trainee = req.user;

    if (!trainee.trainer) {
        res.status(400).json({
            status: 'failed',
            message: 'You do not have a trainer.'
        });
    }

    const trainer = await User.findById(trainee.trainer);

    trainee.trainer = null;
    trainer.clients.pull(trainee);

    try {
        await trainee.save();
        await trainer.save();

        res.status(200).json({
            status: 'success',
            data: {
                trainer: trainee.trainer
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.updateUserGoalsByTrainer = async (req, res) => {
    const { calories, protein, carbohydrates, fats, cholesterol, fiber, micronutrients } = req.body;
    const trainee = await User.findById(req.params.id);

    if (!trainee) {
        return res.status(400).json({
            status: 'failed',
            message: 'Trainee not found.'
        });
    }

    if (trainee.trainer.toString() != req.user._id.toString()) {
        return res.status(400).json({
            status: 'failed',
            message: 'You are not authorized to update this user goals.'
        });
    }

    Object.assign(trainee.goals, {
        calories: calories ? Number(calories) : trainee.goals.calories,
        protein: protein ? Number(protein) : trainee.goals.protein,
        carbohydrates: carbohydrates ? Number(carbohydrates) : trainee.goals.carbohydrates,
        fats: fats ? Number(fats) : trainee.goals.fats,
        cholesterol: cholesterol ? Number(cholesterol) : trainee.goals.cholesterol,
        fiber: fiber ? Number(fiber) : trainee.goals.fiber
    });

    if (micronutrients) {
        for (const [key, value] of Object.entries(micronutrients)) {
            trainee.goals.micronutrients[key] = Number(value);
        }
    }

    try {
        await req.user.save();
        res.status(200).json({
            status: 'success',
            data: trainee.goals
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
}

exports.getAllTrainers = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 10;

    const prevPage = page > 1 ? page - 1 : undefined;
    const nextPage = hasNextPage ? page + 1 : undefined;

    const hasNextPage = await User.find({ role: 'trainer' }).skip(page * count).limit(count).countDocuments() > 0;
    const trainers = await User.find({ role: 'trainer' }).skip((page - 1) * count).limit(count);

    res.status(200).json({
        status: 'success',
        data: { trainers, prevPage, nextPage }
    });
}