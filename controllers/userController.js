const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/common.utils");
const nodemailer = require('nodemailer');


// Display All CRUD Data
const user_index = (req, res) => {
	User.find(function (err, users) {
		res.json(users);
	});
};

// Create New CRUD
const user_create = async (req, res) => {
	await User.deleteOne({ email: req.body.email }).then(function () {
		console.log('deleted');
	});

	await hashPassword(req);

	let user = await new User(req.body);
	await user
		.save()
		.then((user) => {
			res.send(user);
		})
		.catch(function (err) {
			res.status(422).send("user add failed");
		});
};

// Show a particular CRUD Detail by Id
const user_login = (req, res) => {
	User.findOne({ email: req.body.email }, function (err, user) {
		if (!user) {
			res.status(404).send("This email doesn't exist!");
		} else {
			console.log(user._id);
			const isMatch = bcrypt.compare(req.body.password, user.password);
			if (isMatch) {
				const payload = {
					user: {
						id: user._id
					}
				};

				jwt.sign(
					payload,
					'secret',
					(err, token) => {
						if (err) throw err;
						let options = {
							path: "/",
							sameSite: true,
							maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
							httpOnly: false, // The cookie only accessible by the web server
						}


						res.cookie('token', token, options);
						res.send({ type: "success", message: "successful", token, id: user._id });
					}
				);
			} else {
				res.status(401).send("The password is wrong!");
			}
		}
	});
};

// Update CRUD Detail by Id
const user_update = (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body)
		.then(function () {
			res.json("User updated");
		})
		.catch(function (err) {
			res.status(422).send("User update failed.");
		});
};

// Delete CRUD Detail by Id
const user_delete = (req, res) => {
	User.findById(req.params.id, function (err, user) {
		if (!user) {
			res.status(404).send("User not found");
		} else {
			User.findByIdAndRemove(req.params.id)
				.then(function () {
					res.status(200).json("User deleted");
				})
				.catch(function (err) {
					res.status(400).send("User delete failed.");
				});
		}
	});
};

const reset_password = (req, res) => {
	console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, user) {
		if (user) {
			const payload = {
				user: {
					id: user._id,
					email: user.email,
					password: user.password
				}
			};

			jwt.sign(
				payload,
				'secret',
				(err, token) => {
					if (err) throw err;
					sendResetPasswordEmail(user.email, token);
				}
			);
		}
	})
}

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: 'smartluckyman1107@gmail.com',
		pass: 'yjs19981107',
		clientId: '347488470529-kcvc95k39gn7jso22g4oisq68eso965a.apps.googleusercontent.com',
		clientSecret: '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',
		refreshToken: "1//04_olRLuGfBWsCgYIARAAGAQSNwF-L9Iriyq-3lA3_7BtLXvz1rh0SAhmowE98VuLbAiIYnc62Cm7ilWF7bcZeYMQlKZCWyggkrI"
	}
});


const sendResetPasswordEmail = (email, token) => {
	console.log(email, token);
	const resetPasswordLink = `https://simpleruns-frontend.vercel.app/auth/${token}`;
	const mailOptions = {
		from: 'smartluckyman1107@gmail.com',
		to: email,
		subject: 'Nodemailer Project',
		html: `Click <a href="${resetPasswordLink}">here</a> to reset your password.`
	};
	transporter.sendMail(mailOptions, function (err, data) {
		if (err) {
			console.log("Error " + err);
		} else {
			console.log("Email sent successfully");
		}
	});
}

const verify_email = (req, res) => {
	console.log(req.body);
	const token = req.body.token;
	try {
		payload = jwt.verify(token, 'secret');
		return res.status(200).end();
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()
	}

}

const update_password = (req, res) => {
	console.log(req.body);
	const email = req.body.email,
		password = req.body.password;
	User.findOne({ email: email }, async function (err, user) {
		if (user) {
			password = await bcrypt.hash(req.body.password, 8);
			user.password = password;
			await user
				.save()
				.then((user) => {
					res.send(user);
				})
				.catch(function (err) {
					res.status(422).send("user add failed");
				});
		}
	})
}



module.exports = {
	user_index,
	user_login,
	user_create,
	user_update,
	user_delete,
	reset_password,
	verify_email,
	update_password
};
