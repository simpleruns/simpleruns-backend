require("dotenv").config();
const mongoose = require("mongoose");

module.exports = () => {
	const connection = mongoose
		.connect('mongodb+srv://ricardo:machao@cluster0.bvdzxs2.mongodb.net/test')
		.then((result) => console.log("Connected to database"))
		.catch((err) => console.log("could not connect to database"));
};
