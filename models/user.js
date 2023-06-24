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
	avatar: {
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
	abn: {
		type: String
	},
	api: {
		type: String
	},
	website: {
		type: String
	},
	role: {
		type: String
	},
	approved: {
		type: Boolean
	}
});
let User = mongoose.model('User', UserSchema);

module.exports = User;
