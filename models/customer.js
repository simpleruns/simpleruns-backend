const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
    },
    abn: {
        type: String
    },
    userId: {
        type: String
    }

});

let Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;