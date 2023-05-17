const mongoose = require("mongoose");

const PositionSchema = new mongoose.Schema({
    addressName: {
        type: String
    },
    lat: {
        type: String
    },
    lng: {
        type: String,
    },
    userId: {
        type: String
    }
});
let Position = mongoose.model('Position', PositionSchema);

module.exports = Position;