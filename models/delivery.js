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
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    ref: {
        type: String
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
    load: {
        type: Number
    },
    job: {
        type: String
    },
    docket: {
        type: String
    },
    PO: {
        type: String
    },
    status: {
        type: String
    },
    cancelledReason: {
        type: String
    }
});
let Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery;