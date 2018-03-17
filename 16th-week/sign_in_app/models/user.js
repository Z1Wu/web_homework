const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const SALT_FACTOR = 10;
const log = console.log;

const userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: {type: String, required: true, unique: true},
	phone: {type: String, required: true, unique: true},
	studentNumber: { type: String, required: true}
}, {collection : 'userinfo'});

userSchema.pre("save", function(next) {
	// something need to be done before save the user
	var user = this;
	if (!user.isModified("password")) {
		return next();
	}
	// encrypt the password before saving it into database
	bcrypt.genSalt(SALT_FACTOR, function(err, resSalt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, resSalt, null, function(err, hashedPassword) {
		  if (err) {
		  	return next(err);
		  }
		  user.password = hashedPassword;
		  next();
		});
	});
});

userSchema.methods.checkPassword = function(candPw, callback) {
	bcrypt.compare(candPw, this.password, function(err, res) {
		callback(err, res);
	});
};

let User = mongoose.model("User", userSchema);

module.exports = User;
