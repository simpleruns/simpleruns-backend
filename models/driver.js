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
        type: String
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
    licenseNumber: {
        type: String,
    },
    expireDate: {
        type: Date
    },
    cardNumber: {
        type: String,
    },
    publishedDate: {
        type: Date
    },
    licenseClass: {
        type: String
    },
    licenseState: {
        type: String,
    },
    licensePhoto: {
        type: Array
    },
    insurances: {
        type: String
    },
    workCompensation: {
        type: String
    },
    truckRegistration: {
        type: String
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
    approved: {
        type: Boolean
    }
});
let Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;