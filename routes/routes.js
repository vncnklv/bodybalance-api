const express = require("express");

const { signIn, signUp, logout } = require("../controllers/auth");
const { getWeights, addWeight, removeWeight, editWeight, getWeight } = require("../controllers/dailyWeight");
const { getFoods, addFood, getFood, editFood, deleteFood } = require("../controllers/food");
const { getAllDiariesForCurrentUser, addDiary, addFoodToDiary, getDiary, removeFoodFromDiary, updateFoodInDiary } = require("../controllers/diary");

const { isAuth } = require("../middleware/isAuth");
const { setUserGoals, getUserGoals, updateUserGoals, getUserData, updateUserData, setUserGoal } = require("../controllers/user");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signUp", signUp);

router.all('*', isAuth);

router.get("/logout", logout);

router.post('/setUserGoal', setUserGoal);

router
    .route("/user")
    .get(getUserData)
    .patch(updateUserData)

router
    .route("/user/goals")
    .get(getUserGoals)
    .post(setUserGoals)
    .patch(updateUserGoals)

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

router
    .route('/diary')
    .get(getAllDiariesForCurrentUser)
    .post(addDiary)

router
    .route('/diary/:id')
    .get(getDiary)
    .post(addFoodToDiary)

router.
    route('/diary/:id/:meal/:foodId')
    .delete(removeFoodFromDiary)
    .patch(updateFoodInDiary)

module.exports = router;