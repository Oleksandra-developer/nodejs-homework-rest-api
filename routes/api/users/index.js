const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const { validationUser } = require("./validation");

router.post("/signup", validationUser, ctrl.register);
router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify/", ctrl.repeated);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/avatars", guard, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;
