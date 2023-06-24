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

const customer_update = async (req, res) => {
    Customer.findById(req.params.id, async function (err, customer) {
        if (customer) {
            console.log(customer.job);
            if (customer.job) {
                let job = JSON.parse(customer.job);
                job.push({ name: req.body.name, address: req.body.address, lat: 5.115, lng: 5.23 });
                customer.job = JSON.stringify(job);


            } else {
                console.log(req.body);
                let job = [{ name: req.body.name, address: req.body.address, lat: 5.43, lng: 5.46 }];
                console.log('job', job);
                customer.job = JSON.stringify(job);

            }
            await customer.save().then((customer) => { res.status(200).send(customer.job); }
            ).catch(function (err) {
                console.log(err);
                res.status(422).send("jobsite add failed");
            });


        } else {
            res.status(422).send('Add jobsite to company failed');
        }
    })

};

module.exports = {
    customer_create,
    customer_update
}