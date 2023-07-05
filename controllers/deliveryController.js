const Delivery = require("../models/delivery");
const Customer = require("../models/customer");
const Driver = require("../models/driver");

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
    console.log('****************** CREATE DELIVERY **************');
    console.log(req.body);
    await Customer.findById(req.body.customer, async function (err, customer) {
        if (customer) {
            req.body.hourlyRate = customer.localRate;
            console.log("========== CUSTOMER =============");
            console.log(customer)
            req.body.fuelLevy = customer.localRate * req.body.totalHour * customer.fuelLevy / 100;
            req.body.subTotal = customer.localRate * req.body.totalHour + req.body.fuelLevy + req.body.tolls;
            req.body.GST = req.body.subTotal * 0.1;

            Driver.findById(req.body.driver, function (err, driver) {
                if (!driver) {
                    res.status(404).send("Driver not found");
                } else {
                    req.body.driverName = driver.firstname + ' ' + driver.lastname;
                }
            });

            let delivery = await new Delivery(req.body);
            delivery
                .save()
                .then((delivery) => {
                    res.send(delivery);
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(422).send("delivery add failed");
                });
        } else {
            res.status(401).send("Customer doesn't exist");
        }
    }).clone();

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