const express = require("express");
const { signIn, signUp } = require("../controllers/auth");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signUp", signUp);

module.exports = router;