const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

router.post("/signup", ctrl.register);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);
router.get("/current", guard, ctrl.token);

module.exports = router;
