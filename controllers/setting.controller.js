const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");

const logo_updete = async (req, res) => {

    console.log(req.body);
    await User.findOne({ email: req.body.email }).then(function (err, user) {
        user.logo = logo._id;
    });

}