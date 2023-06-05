const Driver = require("../models/driver");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");

// Create New driver
const driver_create = async (req, res) => {
    req.body.birthDate = new Date(req.body.birthDate);
    req.body.expireDate = new Date(req.body.expireDate);
    req.body.publishedDate = new Date(req.body.publishedDate);
    req.body.approved = false;


    const reqLicensePhotos = [];
    const url = req.protocol + '://' + req.get('host');


    for (var i = 0; i < req.files.licensePhoto.length; i++) {
        reqLicensePhotos.push({ 'type': req.files.licensePhoto[i].mimetype, 'url': (url + '/api/public/' + req.files.licensePhoto[i].filename) })
    }
    reqAvatar = { 'type': req.files.avatar[0].mimetype, 'url': (url + '/api/public/' + req.files.avatar[0].filename) };
    req.body.licensePhoto = reqLicensePhotos;
    req.body.avatar = reqAvatar;
    await Driver.deleteOne({ email: req.body.email }).then(function () {
        console.log('deleted');
    });
    await hashPassword(req);

    User.findOne({ email: req.body.userId }, async function (err, user) {
        if (user) {
            console.log(user._id);
            req.body.userId = user._id;
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

        } else {
            res.status(422).send("Company doesn't exist!");
        }
    })
};


const driver_login = (req, res) => {
    console.log(req.body);
    Driver.findOne({ email: req.body.email }, async function (err, driver) {
        if (!driver) {
            res.status(404).send("This email doesn't exist!");
        } else {
            const isMatch = await bcrypt.compare(req.body.password, driver.password);
            console.log(req.body.password, driver.password);
            console.log(isMatch);
            if (driver.approved) {
                if (isMatch) {
                    console.log('login');
                    const payload = {
                        driver: {
                            id: driver._id
                        }
                    };

                    jwt.sign(
                        payload,
                        'secret',
                        (err, token) => {
                            if (err) throw err;
                            let options = {
                                path: "/",
                                sameSite: true,
                                maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                                httpOnly: false, // The cookie only accessible by the web server
                            }



                            res.cookie('token', token, options);
                            res.send({ type: "success", message: "successful", token, id: driver._id, userId: driver.userId });





                        }
                    );
                } else {
                    res.status(401).send("The password is wrong!");
                }

            } else {
                res.status(401).send("Driver is not approved!");
            }
        }
    });
};

module.exports = {
    driver_create,
    driver_login
};
