module.exports = {
	...require("./verify-signup.middleware"),
	...require("./auth-jwt.middleware"),
};
