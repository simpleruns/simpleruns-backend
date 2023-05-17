const mongoose = require("mongoose");

const TollsSchema = new mongoose.Schema({
    data: Array,
    userId: String
});

let Tolls = mongoose.model('Tolls', TollsSchema);

module.exports = Tolls;
