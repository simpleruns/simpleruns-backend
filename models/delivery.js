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
    Date: {
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
    }

});
let Delivery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delivery;