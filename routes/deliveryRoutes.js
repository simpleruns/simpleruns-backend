const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

router.get("/", deliveryController.delivery_index);
router.post("/create", deliveryController.delivery_create);

module.exports = router;