const Customer = require("../models/customer");
const User = require("../models/user");
const Delivery = require("../models/delivery");

const DIR = './api/public/';

const invoice_index = (req, res) => {
    Customer.find(function (err, customers) {
        var totalCount;

        if (req.query.user) {
            customers = customers.filter(item => (item.userId == req.query.user));
        }

        totalCount = customers.length;
        if (req.query.page) {
            var from, to;
            from = (parseInt(req.query.page) - 1) * 10;
            to = parseInt(req.query.page) * 10 - 1;
            customers.slice(from, to);
        }

        res.json({ customers, totalCount });
        // res.json(drivers);
    });
};

const invoice_single = (req, res) => {
    var data = {};
    Customer.findById(req.params.id, async function (err, customer) {
        if (!customer) {
            res.status(404).send("Customer not found");
        } else {
            data.customerName = customer.companyName;
            data.customerAddress = customer.address;
            data.customerPhone = customer.phone;
            data.abn = customer.abn;
            data.invoiceNumber = '5024';
            const milliseconds = parseInt(req.query.end);
            const date = new Date(milliseconds);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            data.date = formattedDate;

            User.findOne({ _id: req.query.user }, async function (err, user) {
                if (user) {
                    data.adminAddress = user.address;
                    data.adminPhone = user.phone;
                    data.adminEmail = user.email;
                    data.adminBank = user.bank;
                    data.adminName = user.firstname + ' ' + user.lastname;
                    data.adminBSB = user.bsb;
                    data.adminAccountNo = user.accountNo;
                    data.adminCompany = user.company;
                    data.logo = user.logo;

                    Delivery.find({ customer: req.params.id, user: req.query.user }, function (err, deliveries) {
                        data.deliveries = deliveries.filter(item => (item.startTime.valueOf() > parseInt(req.query.start) && item.endTime.valueOf() < parseInt(req.query.end)));
                        res.send(data);
                    });
                }
            })
        }
    });
};

module.exports = {
    invoice_index,
    invoice_single
};