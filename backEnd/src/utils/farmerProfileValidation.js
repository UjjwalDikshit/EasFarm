// validations/farmerProfileValidation.js
const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(50),
  alternateMobile: Joi.string().pattern(/^[0-9]{10}$/),
  villageOrCity: Joi.string(),
  district: Joi.string(),
  state: Joi.string(),
  pincode: Joi.string().pattern(/^[0-9]{6}$/),
  allowDataSharing: Joi.boolean(),
});

exports.interestsSchema = Joi.object({
  categories: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
});

exports.locationSchema = Joi.object({
  coordinates: Joi.array().items(Joi.number()).length(2).required(),
});