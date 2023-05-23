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
		type: String
	},
	logo: {
		type: Object
	},
	bank: {
		type: String
	},
	address: {
		type: String
	},
	bsb: {
		type: String
	},
	accountNo: {
		type: String
	},
	company: {
		type: String
	},
	api: {
		type: String
	}
});
let User = mongoose.model('User', UserSchema);

module.exports = User;
