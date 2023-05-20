const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

router.get("/customer/:id", deliveryController.delivery_getByCustomer);

module.exports = router;