const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.userSchema = Joi.object({
    username: Joi.string()
        .escapeHTML()
        .alphanum()
        .min(3)
        .max(30)
        .required(30),
    email: Joi.string()
        .escapeHTML()
        .email()
        .required(),
    password: Joi.string()
        .escapeHTML()
        .required()
})