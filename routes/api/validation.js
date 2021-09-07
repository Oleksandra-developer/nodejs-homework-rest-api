const Joi = require("joi");
const mongoose = require("mongoose");

const schemaCreateContacts = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().min(5).max(20).required(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdateContacts = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string().min(5).max(20).optional(),
  favorite: Joi.boolean().optional(),
}).or("name", "email", "phone");

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationCreateContacts: (req, res, next) => {
    return validate(schemaCreateContacts, req.body, next);
  },
  validationUpdateContacts: (req, res, next) => {
    return validate(schemaUpdateContacts, req.body, next);
  },
  validationUpdateStatusContact: (req, res, next) => {
    return validate(schemaUpdateStatusContact, req.body, next);
  },
  validateMongoId: (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: 400,
        message: "Invalid ObjectId",
      });
    }
    next();
  },
};
