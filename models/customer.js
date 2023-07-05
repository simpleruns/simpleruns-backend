const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    photo: {
        type: Object,
    },
    companyName: {
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
        default: 0.0,
    },
    countryRate: {
        type: Number,
        default: 0.0,
    },
    loadRate: {
        type: Number,
        default: 0.0,
    },
    fuelLevy: {
        type: Number,
        default: 0.0,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    abn: {
        type: String
    },
    userId: {
        type: String
    },
    abn: {
        type: String
    },
    job: {
        type: String
    },
});

let Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;