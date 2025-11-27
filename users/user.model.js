const mongoose = require("mongoose");

const { GENDER_LIST } = require("../utils/constants");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"]
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required"]
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"]
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"]
    },
    gender: {
      type: String,
      enum: GENDER_LIST,
      required: [true, "Gender is required"]
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Too short password"]
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExp: Date,
    passwordResetCodeVerified: Boolean,
    verificationCode: String,
    verificationCodeExp: Date,
    verificationCodeVerified: Boolean,
    deactivatedAt: Date,
    verified: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
