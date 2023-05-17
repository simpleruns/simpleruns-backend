const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.user_index);
router.post("/", userController.user_create);
router.post("/reset/generate", userController.reset_password);
router.post("/verify", userController.verify_email);
router.put('/update_password', userController.update_password);
router.post("/login", userController.user_login);
router.patch("/:id", userController.user_update);
router.delete("/:id", userController.user_delete);

module.exports = router;
