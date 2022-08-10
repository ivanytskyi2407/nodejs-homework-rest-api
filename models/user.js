const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);
const User = model("user", userSchema);

const joiRegisterSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
});
const joiLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
const joiEmailSchema = Joi.object({
  email: Joi.string().required(),
});
module.exports = { User, joiRegisterSchema, joiLoginSchema, joiEmailSchema };
