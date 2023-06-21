const Customer = require("../models/customer");

// Create New Customer
const customer_create = async (req, res) => {
    console.log('sdfsd');
    console.log(req.body);

    await Customer.deleteOne({ companyName: new RegExp(req.body.companyName, 'i') }).then(function () {
        console.log('deleted');
    });
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
};

module.exports = {
    customer_create
}