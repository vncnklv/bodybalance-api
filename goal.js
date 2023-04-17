const acLevel = {
    'sedentary': 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'active': 1.725,
    'very active': 1.9
}

const calculateCaloriesAndNutrients = (user) => {
    const BMR = user.gender == 'male' ? 66.47 + (13.75 * user.currentWeight) + (5.003 * user.height) - (6.755 * user.age) : 655.1 + (9.563 * user.currentWeight) + (1.850 * user.height) - (4.676 * user.age);
    const AMR = BMR * acLevel[user.activityLevel];
    let calories = user.goal == 'lose weight' ? AMR - 500 : user.goal == 'gain weight' ? AMR + 500 : AMR;
    calories = Math.round(calories);

    const protein = (user.activityLevel == 'sedentary' ? 1.6 : user.activityLevel == 'lightly active' ? 1.8 : user.activityLevel == 'moderately active' ? 2 : 2.2) * user.currentWeight;
    const carbohydrates = Math.round((calories - protein * 4) * 0.6 / 4);
    const fats = Math.round((calories - protein * 4 - carbohydrates * 4) / 9);
    const cholesterol = 0.3;
    const fiber = 25;
    const micronutrients = {
        calcium: 0.8,
        sulfur: 1.3,
        phosphorus: 0.7,
        magnesium: 0.4,
        sodium: 1.5,
        potassium: 4.7,
        iron: 8,
        zinc: 11,
        boron: 1.5,
        copper: 0.9,
        chromium: 35,
        selenium: 55,
        manganese: 2.3,
        molybdenum: 45,
        cobalt: 0.9,
        fluorine: 4,
        iodine: 150,
        vitaminA: 900,
        vitaminC: 90,
        vitaminD: 15,
        vitaminE: 15,
        vitaminK: 120,
        carotenoids: 2.5,
        niacin: 16,
        vitaminB6: 1.3,
        vitaminB12: 2.4,
        folate: 400,
        pantothenicAcid: 5
    }

    return {
        calories,
        protein,
        carbohydrates,
        fats,
        cholesterol,
        fiber,
        micronutrients
    }
}

module.exports = calculateCaloriesAndNutrients;
