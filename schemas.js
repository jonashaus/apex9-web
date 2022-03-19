const Joi = require('joi');

module.exports.userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(30),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
})