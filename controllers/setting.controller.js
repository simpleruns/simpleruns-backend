const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");

const logo_updete = async (req, res) => {

    console.log(req.body.emaiil);

    await User.findOne({ email: req.body.email }).then(async function (err, user) {
        user.logo = req.body.logo;
        user.logoTitle = req.body.title;
        await user
            .save()
            .then((user) => {
                res.send(user);
            })
            .catch(function (err) {
                res.status(422).send("user update failed");
            });
    });

}

module.exports = {
    logo_updete
}