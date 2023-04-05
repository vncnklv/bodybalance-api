const express = require("express");
const { signIn, signUp } = require("../controllers/auth");
const { getWeights, addWeight, removeWeight, editWeight, getWeight } = require("../controllers/daily_weight");
const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signUp", signUp);

router
    .route('/user/weight/')
    .all(isAuth)
    .get(getWeights)
    .post(addWeight)

router
    .route('/user/weight/:id')
    .all(isAuth)
    .get(getWeight)
    .delete(removeWeight)
    .patch(editWeight)

module.exports = router;