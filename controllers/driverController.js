const Driver = require("../models/driver");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");

const DIR = './public/';
// Display All driver Data
const driver_index = (req, res) => {

    Driver.find(function (err, drivers) {
        if (req.query.search) {
            drivers = drivers.filter(item => (item.firstname + item.lastname + item.numberPlate + item.VIN).includes(req.query.search));
        }
        if (req.query.status) {
            drivers = drivers.filter(item => (item.approved == (req.query.status == "approved" ? true : false)));
        }
        res.json(drivers);
    });
};

// Create New driver
const driver_create = async (req, res) => {
    const reqLicensePhotos = [];
    const url = req.protocol + '://' + req.get('host');


    for (var i = 0; i < req.files.licensePhoto.length; i++) {
        reqLicensePhotos.push(url + '/public/' + req.files.licensePhoto[i].filename)
    }
    reqAvatar = url + '/public/' + req.files.avatar[0].filename;
    req.body.licensePhoto = reqLicensePhotos;
    req.body.avatar = reqAvatar;
    await Driver.deleteOne({ email: req.body.email }).then(function () {
        console.log('deleted');
    });
    await hashPassword(req);
    let driver = await new Driver(req.body);
    await driver
        .save()
        .then((driver) => {
            res.send(driver);
        })
        .catch(function (err) {
            console.log(err);
            res.status(422).send("driver add failed");
        });
};

const driver_getOne = async (req, res) => {
    Driver.findById(req.params.id, function (err, driver) {
        if (!driver) {
            res.status(404).send("Driver not found");
        } else {
            res.send(driver);
        }
    });
}


const driver_update = async (req, res) => {

    if (req.body.resetPassword) {
        await hashPassword(req);
        await Driver.findByIdAndUpdate(req.params.id, req.body)
            .then(function (driver) {
                res.json("Driver updated");
            })
            .catch(function (err) {
                res.status(422).send("Driver update failed.");
            });
    } else {
        Driver.findById(req.params.id, async function (err, driver) {
            if (driver) {
                driver.firstname = req.body.firstname;
                driver.lastname = req.body.lastname;
                driver.email = req.body.email;
                driver.phone = req.body.phone;
                driver.year = req.body.year;
                driver.numberPlate = req.body.numberPlate;
                driver.VIN = req.body.VIN;
                driver.approved = req.body.approved;
                await driver
                    .save()
                    .then((driver) => {
                        res.send(driver);
                    })
                    .catch(function (err) {
                        res.status(422).send("driver update failed");
                    });

            } else {
                res.status(404).send("Driver not found");
            }
        })
    }
};

// Delete driver Detail by Id
const driver_delete = (req, res) => {
    Driver.findById(req.params.id, function (err, driver) {
        if (!driver) {
            res.status(404).send("Driver not found");
        } else {
            Driver.findByIdAndRemove(req.params.id)
                .then(function () {
                    res.status(200).json("Driver deleted");
                })
                .catch(function (err) {
                    res.status(400).send("Driver delete failed.");
                });
        }
    });
};

const driver_approve = (req, res) => {
    Driver.findById(req.params.id, async function (err, driver) {
        if (!driver) {
            res.status(404).send("Driver not found");
        } else {
            driver.approved = !driver.approved;
            await driver
                .save()
                .then((driver) => {
                    res.send(driver);
                })
                .catch(function (err) {
                    res.status(422).send("driver approve change failed");
                });

        }
    })
}

module.exports = {
    driver_index,
    driver_create,
    driver_getOne,
    driver_delete,
    driver_approve,
    driver_update
};