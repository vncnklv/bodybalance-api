
// TODO: set userdata
// exports.setUserData = (req, res, next) => {}
// exports.getUserData = (req, res, next) => {}

exports.getUserGoals = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: req.user.goals
    });
}

exports.setUserGoals = async (req, res) => {
    const { calories, protein, carbohydrates, fats, cholesterol, fiber, macronutrients } = req.body;
    const goals = {
        calories: Number(calories),
        protein: Number(protein),
        carbohydrates: Number(carbohydrates),
        fats: Number(fats),
        cholesterol: cholesterol ? Number(cholesterol) : 0.3,
        fiber: fiber ? Number(fiber) : 25,
        micronutrients: {
            calcium: macronutrients && macronutrients.calcium ? Number(macronutrients.calcium) : 0.8,
            sulfur: macronutrients && macronutrients.sulfur ? Number(macronutrients.sulfur) : 1.3,
            phosphorus: macronutrients && macronutrients.phosphorus ? Number(macronutrients.phosphorus) : 0.7,
            magnesium: macronutrients && macronutrients.magnesium ? Number(macronutrients.magnesium) : 0.4,
            sodium: macronutrients && macronutrients.sodium ? Number(macronutrients.sodium) : 1.5,
            potassium: macronutrients && macronutrients.potassium ? Number(macronutrients.potassium) : 4.7,
            iron: macronutrients && macronutrients.iron ? Number(macronutrients.iron) : 8,
            zinc: macronutrients && macronutrients.zinc ? Number(macronutrients.zinc) : 11,
            boron: macronutrients && macronutrients.boron ? Number(macronutrients.boron) : 1.5,
            copper: macronutrients && macronutrients.copper ? Number(macronutrients.copper) : 0.9,
            chromium: macronutrients && macronutrients.chromium ? Number(macronutrients.chromium) : 35,
            selenium: macronutrients && macronutrients.selenium ? Number(macronutrients.selenium) : 55,
            manganese: macronutrients && macronutrients.manganese ? Number(macronutrients.manganese) : 2.3,
            molybdenum: macronutrients && macronutrients.molybdenum ? Number(macronutrients.molybdenum) : 45,
            cobalt: macronutrients && macronutrients.cobalt ? Number(macronutrients.cobalt) : 0.05,
            fluorine: macronutrients && macronutrients.fluorine ? Number(macronutrients.fluorine) : 4,
            iodine: macronutrients && macronutrients.iodine ? Number(macronutrients.iodine) : 150,
            vitaminA: macronutrients && macronutrients.vitaminA ? Number(macronutrients.vitaminA) : 900,
            vitaminC: macronutrients && macronutrients.vitaminC ? Number(macronutrients.vitaminC) : 90,
            vitaminD: macronutrients && macronutrients.vitaminD ? Number(macronutrients.vitaminD) : 15,
            vitaminE: macronutrients && macronutrients.vitaminE ? Number(macronutrients.vitaminE) : 15,
            vitaminK: macronutrients && macronutrients.vitaminK ? Number(macronutrients.vitaminK) : 120,
            carotenoids: macronutrients && macronutrients.carotenoids ? Number(macronutrients.carotenoids) : 6,
            niacin: macronutrients && macronutrients.niacin ? Number(macronutrients.niacin) : 16,
            vitaminB6: macronutrients && macronutrients.vitaminB6 ? Number(macronutrients.vitaminB6) : 1.3,
            vitaminB12: macronutrients && macronutrients.vitaminB12 ? Number(macronutrients.vitaminB12) : 2.4,
            folate: macronutrients && macronutrients.folate ? Number(macronutrients.folate) : 400,
            pantothenicAcid: macronutrients && macronutrients.pantothenicAcid ? Number(macronutrients.pantothenicAcid) : 5
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

exports.updateUserGoals = async (req, res, next) => {
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