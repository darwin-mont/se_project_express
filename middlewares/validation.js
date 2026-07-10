const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// === CUSTOM URL VALIDATOR === //
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// === CUSTOM ID VALIDATOR === //
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 30 characters",
      "any.required": "Name is required",
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.base": "Weather must be a string",
      "string.empty": "Weather is required",
      "any.only": "Weather must be one of: hot, warm, cold",
      "any.required": "Weather is required",
    }),
    imageUrl: Joi.string().custom(validateURL).required().messages({
      "string.empty": 'the "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" must be a valid URL',
    }),
  }),
});
// === USER REGISTRATION VALIDATION === //
const validateUserRegistration = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 30 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      "string.base": "Avatar URL must be a string",
      "string.empty": "Avatar URL is required",
      "string.uri": "Avatar URL must be a valid URL",
      "any.required": "Avatar URL is required",
    }),
  }),
});

// === USER LOGIN VALIDATION === //
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  }),
});

// === UPDATE PROFILE VALIDATION === //
const validateUpdateProfile = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).messages({
        "string.base": "Name must be a string",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 30 characters",
      }),
      avatar: Joi.string().custom(validateURL).messages({
        "string.base": "Avatar URL must be a string",
        "string.uri": "Avatar URL must be a valid URL",
      }),
    })
    .min(1)
    .messages({
      "object.min": "At least one field (name or avatar) is required",
    }),
});

// === ID VALIDATION === //
const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isMongoId(value)) {
          return helpers.error("string.pattern.base");
        }
        return value;
      })
      .required()
      .messages({
        "string.base": "ID must be a string",
        "string.empty": "ID is required",
        "string.pattern.base":
          "ID must be a valid 24-character hexadecimal string",
        "any.required": "ID is required",
      }),
  }),
});

// ========== EXPORTS ==========
module.exports = {
  validateClothingItem,
  validateUserRegistration,
  validateUserLogin,
  validateUpdateProfile,
  validateId,
};
