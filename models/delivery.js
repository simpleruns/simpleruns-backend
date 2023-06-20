const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "Driver"
    },
    driverName: {
        type: String
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    description: {
        type: String
    },
    tolls: {
        type: Number
    },
    totalHour: {
        type: Number
    },
    hourlyRate: {
        type: Number
    },
    fuelLevy: {
        type: Number
    },
    subTotal: {
        type: Number
    },
    GST: {
        type: Number
    },
    status: {
        type: String
    },
    cancelledReason: {
        type: String
    },
    runsheet: {
        type: String,
    },
    truckID: {
        type: String
    },
    trailerID: {
        type: String
    }
});
let Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery;