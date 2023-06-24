const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DriverSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    role: {
        type: String,
    },
    avatar: {
        type: Object
    },
    birthDate: {
        type: Date,
    },
    email: {
        type: String
    },
    password: {
        type: String,
    },
    phone: {
        type: String
    },
    licenceNumber: {
        type: String,
    },
    expireDate: {
        type: Date
    },
    cardNumber: {
        type: String,
    },
    licenceClass: {
        type: String
    },
    licenceState: {
        type: String,
    },
    licencePhoto: {
        type: Array
    },
    insuranceFile: {
        type: Array
    },
    workCompensationFile: {
        type: Array
    },
    truckRegistrationFile: {
        type: Array
    },
    year: {
        type: Number
    },
    numberPlate: {
        type: String
    },
    VIN: {
        type: String
    },
    category: {
        type: String
    },
    make: {
        type: String
    },
    model: {
        type: String
    },
    approved: {
        type: Boolean
    },
    userId: {
        type: String
    }
});
let Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;