const express = require("express");

const { signIn, signUp, logout } = require("../controllers/auth");
const { getWeights, addWeight, removeWeight, editWeight, getWeight } = require("../controllers/dailyWeight");
const { getFoods, addFood, getFood, editFood, deleteFood, getFoodsForCurrentUser } = require("../controllers/food");
const { getAllDiariesForCurrentUser, addDiary, addFoodToDiary, getDiary, removeFoodFromDiary, updateFoodInDiary, getTodaysDiary } = require("../controllers/diary");
const { setUserGoals, getUserGoals, updateUserGoals, getUserData, updateUserData, setUserGoal, updateUserGoalsByTrainer, hireTrainer, unhireTraner, getAllTrainers, changePassword, becomeATraniner, getAllTrainerClients, getAllUsers, deleteUserByAdmin, demoteTrainer } = require("../controllers/user");

const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signUp", signUp);

router.all('*', isAuth);

router.get("/logout", logout);

router.post('/setUserGoal', setUserGoal);

router.post('/changePassword', changePassword);

router.get('/users', getAllUsers);

router
    .route("/user")
    .get(getUserData)
    .patch(updateUserData)

router
    .route('/user/trainer')
    .post(hireTrainer)
    .delete(unhireTraner);

router.delete('/user/:id', deleteUserByAdmin);

router
    .route("/user/goals")
    .get(getUserGoals)
    .post(setUserGoals)
    .patch(updateUserGoals)

router.patch('/user/trainer/:id', demoteTrainer);

router.get('/user/trainers', getAllTrainers);
router.get('/user/clients', getAllTrainerClients);

router.post('/becomeTrainer', becomeATraniner);

router.patch('/user/goals/:id', updateUserGoalsByTrainer)

router.get('/user/foods', getFoodsForCurrentUser);

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


router.get('allDiaries', getAllDiariesForCurrentUser);

router
    .route('/diary')
    .get(getTodaysDiary)
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