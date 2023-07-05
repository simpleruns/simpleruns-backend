if (process.env.NODE_ENV === 'production') {
	require('dotenv').config({ path: '.env' });
} else {
	require('dotenv').config({ path: '.env.development' });
}
const mongoose = require("mongoose");

module.exports = () => {
	const connection = mongoose
		.connect(process.env.DATABASE_URL)
		.then((result) => console.log("Connected to database"))
		.catch((err) => console.log("could not connect to database"));
};
