const Driver = require("../models/driver");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");

const DIR = './api/public/';
// Display All driver Data
const driver_index = (req, res) => {
    Driver.find(function (err, drivers) {
        var totalCount;
        if (req.query.search) {
            drivers = drivers.filter(item => (item.firstname + item.lastname + item.numberPlate + item.VIN).includes(req.query.search));
        }
        if (req.query.status) {
            drivers = drivers.filter(item => (item.approved == (req.query.status == "approved" ? true : false)));
        }
        if (req.query.user) {
            drivers = drivers.filter(item => (item.userId == req.query.user));
        }

        totalCount = drivers.length;
        if (req.query.page) {
            var from, to;
            from = (parseInt(req.query.page) - 1) * 10;
            to = parseInt(req.query.page) * 10 - 1;
            drivers = drivers.slice(from, to);
        }

        res.json({ drivers, totalCount });
        // res.json(drivers);
    });
};

// Create New driver
const driver_create = async (req, res) => {
    var flag = false;
    await Driver.findOne({ email: req.body.email }).then(function (driver) {
        if (driver) {
            res.send('The email is already in use.');
            flag = true;
        }
    })

    if (!flag) {
        const reqLicensePhotos = [];
        const reqInsuranceFile = [];
        const reqWorkCompensationFile = [];
        const reqTruckRegistrationFile = [];
        const url = req.protocol + '://' + req.get('host');

        for (var i = 0; i < req.files.licensePhoto.length; i++) {
            reqLicensePhotos.push({ 'type': req.files.licensePhoto[i].mimetype, 'url': (url + '/api/public/' + req.files.licensePhoto[i].filename) })
        }
        if (req.body.role == 'subcontractor') {
            for (var i = 0; i < req.files.insuranceFile.length; i++) {
                reqInsuranceFile.push({ 'type': req.files.insuranceFile[i].mimetype, 'url': (url + '/api/public/' + req.files.insuranceFile[i].filename) })
            }
            for (var i = 0; i < req.files.workCompensationFile.length; i++) {
                reqWorkCompensationFile.push({ 'type': req.files.workCompensationFile[i].mimetype, 'url': (url + '/api/public/' + req.files.workCompensationFile[i].filename) })
            }
            for (var i = 0; i < req.files.truckRegistrationFile.length; i++) {
                reqTruckRegistrationFile.push({ 'type': req.files.truckRegistrationFile[i].mimetype, 'url': (url + '/api/public/' + req.files.truckRegistrationFile[i].filename) })
            }
            req.body.insuranceFile = reqInsuranceFile;
            req.body.workCompensationFile = reqWorkCompensationFile;
            req.body.truckRegistrationFile = reqTruckRegistrationFile;
        }
        reqAvatar = { 'type': req.files.avatar[0].mimetype, 'url': (url + '/api/public/' + req.files.avatar[0].filename) };
        req.body.licensePhoto = reqLicensePhotos;
        req.body.avatar = reqAvatar;
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
    }
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
    var flag = false;

    await Driver.findOne({ email: req.body.email }).then(function (driver) {
        if (driver) {
            res.send('The email is already in use.');
            flag = true;
        }
    })

    if (!flag) {
        const reqLicensePhotos = [];
        const reqInsuranceFile = [];
        const reqWorkCompensationFile = [];
        const reqTruckRegistrationFile = [];
        const url = req.protocol + '://' + req.get('host');

        if (req.body.role == 'subcontractor') {
            for (var i = 0; i < req.files.insuranceFile.length; i++) {
                reqInsuranceFile.push({ 'type': req.files.insuranceFile[i].mimetype, 'url': (url + '/api/public/' + req.files.insuranceFile[i].filename) })
            }
            for (var i = 0; i < req.files.workCompensationFile.length; i++) {
                reqWorkCompensationFile.push({ 'type': req.files.workCompensationFile[i].mimetype, 'url': (url + '/api/public/' + req.files.workCompensationFile[i].filename) })
            }
            for (var i = 0; i < req.files.truckRegistrationFile.length; i++) {
                reqTruckRegistrationFile.push({ 'type': req.files.truckRegistrationFile[i].mimetype, 'url': (url + '/api/public/' + req.files.truckRegistrationFile[i].filename) })
            }
            req.body.insuranceFile = reqInsuranceFile;
            req.body.workCompensationFile = reqWorkCompensationFile;
            req.body.truckRegistrationFile = reqTruckRegistrationFile;
        }
        for (var i = 0; i < req.files.licensePhoto.length; i++) {
            reqLicensePhotos.push({ 'type': req.files.licensePhoto[i].mimetype, 'url': (url + '/api/public/' + req.files.licensePhoto[i].filename) })
        }
        reqAvatar = { 'type': req.files.avatar[0].mimetype, 'url': (url + '/api/public/' + req.files.avatar[0].filename) };
        req.body.licensePhoto = reqLicensePhotos;
        req.body.avatar = reqAvatar;

        if (req.body.resetPassword) {
            await hashPassword(req);
            await Driver.findByIdAndUpdate(req.params.id, req.body)
                .then(function (driver) {
                    res.json(driver);
                })
                .catch(function (err) {
                    res.status(422).send("Driver update failed.");
                });
        } else {
            Driver.findById(req.params.id, async function (err, driver) {
                if (driver) {
                    driver.firstname = req.body.firstname;
                    driver.lastname = req.body.lastname;
                    driver.role = req.body.role;
                    driver.avatar = req.body.avatar;
                    driver.birthDate = req.body.birthDate;
                    driver.licenseNumber = req.body.licenseNumber;
                    driver.cardNumber = req.body.cardNumber;
                    driver.expireDate = req.body.expireDate;
                    driver.licenseCalss = req.body.licenseCalss;
                    driver.licenseState = req.body.licenseState;
                    driver.licensePhoto = req.body.licensePhoto;
                    driver.insuranceFile = req.body.insuranceFile;
                    driver.workCompensationFile = req.body.workCompensationFile;
                    driver.truckRegistrationFile = req.body.truckRegistrationFile;
                    driver.email = req.body.email;
                    driver.phone = req.body.phone;
                    driver.year = req.body.year;
                    driver.numberPlate = req.body.numberPlate;
                    driver.VIN = req.body.VIN;
                    driver.category = req.body.category;
                    driver.make = req.body.make;
                    driver.model = req.body.model;
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