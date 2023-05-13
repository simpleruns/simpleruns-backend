const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new mongoose.Schema({
    photo: {
        type: Object,
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    rateType: {
        type: String,
    },
    localRate: {
        type: Number,
    },
    countryRate: {
        type: Number
    },
    loadRate: {
        type: Number
    },
    fuelRate: {
        type: Number
    },
    approved: {
        type: Boolean
    }

});

let Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;