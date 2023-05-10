const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogoSchema = new mongoose.Schema({
    url: {
        type: String,
    }
});
let Logo = mongoose.model('Logo', LogoSchema);

module.exports = Logo;