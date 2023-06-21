const express = require("express");
const router = express.Router();
const mobileCustomerController = require("../../controllers/mobileCustomerController");


router.post("/create", mobileCustomerController.customer_create);

module.exports = router;