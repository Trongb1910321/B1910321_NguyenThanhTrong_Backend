const express = require("express");
const auth = require("../controllers/auth.controller");
const { checkDuplicateUsernameOrEmail } = require("../middlewares");

const router = express.Router();

router.post("/signup", [checkDuplicateUsernameOrEmail], auth.signup);
router.post("/signin", auth.signin);

module.exports = router;
