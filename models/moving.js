const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovingSchema = new mongoose.Schema({
    departureTime: {
        type: Date
    },
    arrivalTime: {
        type: Date
    },
    startPoint: {
        type: String
    },
    endPoint: {
        type: String
    }
})