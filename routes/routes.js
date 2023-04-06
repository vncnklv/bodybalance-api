const express = require("express");
const { signIn, signUp } = require("../controllers/auth");
const { getWeights, addWeight, removeWeight, editWeight, getWeight } = require("../controllers/dailyWeight");
const { getFoods, addFood, getFood, editFood, deleteFood } = require("../controllers/food");

const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signUp", signUp);

router.all('*', isAuth);

router
    .route('/user/weight/')
    .get(getWeights)
    .post(addWeight)

router
    .route('/user/weight/:id')
    .get(getWeight)
    .delete(removeWeight)
    .patch(editWeight)

router
    .route('/food')
    .get(getFoods)
    .post(addFood)

router
    .route('/food/:id')
    .get(getFood)
    .patch(editFood)
    .delete(deleteFood)

module.exports = router;