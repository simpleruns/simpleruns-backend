const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	email: {
		type: String
	},
	phone: {
		type: String
	},
	password: {
		type: String,
	}
});
let User = mongoose.model('User', UserSchema);

module.exports = User;
