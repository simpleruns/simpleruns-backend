const Delivery = require("../models/delivery");
const deliveries = require('../utils/deliveries.json');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");

const DIR = './api/public/';
// Display All driver Data
const delivery_index = (req, res) => {
    Delivery.find(function (err, deliveries) {
        res.json(deliveries);
    });
};

const delivery_create = async (req, res) => {
    await deliveries.forEach(async (item) => {
        let delivery = await new Delivery(item);
        await delivery
            .save();
    })
}

const delivery_getByCustomer = async (req, res) => {
    Delivery.find({ customer: req.params.id }, function (err, deliveries) {
        res.send(deliveries);
    });
}


module.exports = {
    delivery_index,
    delivery_create,
    delivery_getByCustomer
};