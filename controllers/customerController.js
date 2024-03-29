const Customer = require("../models/customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");

const DIR = './public/';
// Display All driver Data
const customer_index = (req, res) => {
    Customer.find(function (err, customers) {
        var totalCount;
        if (req.query.search) {
            customers = customers.filter(item => (item.name + item.email + item.address).includes(req.query.search));
        }
        if (req.query.status) {
            customers = customers.filter(item => (item.approved == (req.query.status == "approved" ? true : false)));
        }
        if (req.query.user) {
            customers = customers.filter(item => (item.userId == req.query.user));
        }
        totalCount = customers.length;
        if (req.query.page) {
            var from, to;
            from = (parseInt(req.query.page) - 1) * 10;
            to = parseInt(req.query.page) * 10 - 1;
            customers = customers.slice(from, to);
        }

        res.json({ customers, totalCount });
    });
};

// Create New Customer
const customer_create = async (req, res) => {
    var flag = false;
    const url = req.protocol + '://' + req.get('host');

    reqAvatar = { 'url': (url + '/api/public/' + req.file.filename), 'type': req.file.mimetype };
    req.body.photo = reqAvatar;
    await Customer.findOne({ email: req.body.email }).then(function (customer) {
        if (customer) {
            res.send('The email is already in use.');
            flag = true;
        }
    });

    if (!flag) {
        await hashPassword(req);
        let customer = await new Customer(req.body);
        await customer
            .save()
            .then((customer) => {
                res.send(customer);
            })
            .catch(function (err) {
                console.log(err);
                res.status(422).send("customer add failed");
            });
    }
};

const customer_getOne = async (req, res) => {
    Customer.findById(req.params.id, function (err, customer) {
        if (!customer) {
            res.status(404).send("Customer not found");
        } else {
            res.send(customer);
        }
    });
}

const customer_update = async (req, res) => {
    var flag = false;

    await Customer.findOne({ email: req.body.email }).then(function (customer) {
        if (customer) {
            res.send('The email is already in use.');
            flag = true;
        }
    });

    if (!flag) {
        const url = req.protocol + '://' + req.get('host');

        reqAvatar = { 'url': (url + '/api/public/' + req.file.filename), 'type': req.file.mimetype };
        req.body.photo = reqAvatar;

        await Customer.findByIdAndUpdate(req.params.id, req.body)
            .then(function (customer) {
                res.json("Customers  updated");
            })
            .catch(function (err) {
                res.status(422).send("Customers update failed.");
            });
    }
};

// Delete driver Detail by Id
const customer_delete = (req, res) => {
    Customer.findById(req.params.id, function (err, customer) {
        if (!customer) {
            res.status(404).send("Customer not found");
        } else {
            Customer.findByIdAndRemove(req.params.id)
                .then(function () {
                    res.status(200).json("Customer deleted");
                })
                .catch(function (err) {
                    res.status(400).send("Customer delete failed.");
                });
        }
    });
};

const customer_approve = (req, res) => {
    Customer.findById(req.params.id, async function (err, customer) {
        if (!customer) {
            res.status(404).send("CUstomer not found");
        } else {
            customer.approved = !customer.approved;
            await customer
                .save()
                .then((customer) => {
                    res.send(customer);
                })
                .catch(function (err) {
                    res.status(422).send("customer approve change failed");
                });
        }
    })
}

module.exports = {
    customer_index,
    customer_create,
    customer_getOne,
    customer_delete,
    customer_approve,
    customer_update
};