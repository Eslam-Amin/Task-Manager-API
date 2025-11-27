const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const config = require("../config");
const { GENDER_LIST } = require("../utils/constants");
const Hash = require("../utils/hash");
const UserDTO = require("./user.dto");

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
      lowercase: true,
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
    sessionTokenId: String,
    verified: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        return UserDTO.toUserDTO(ret);
      }
    }
  }
);

userSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName)
    return this.firstName + " " + this.lastName;
});

userSchema.virtual("age").get(function () {
  const currentDate = new Date();
  const birthDate = new Date(this.dateOfBirth);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  // Adjust age if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }
  return age;
});

userSchema.methods.generateToken = async function () {
  const sessionTokenId = uuid.v4();

  const token = jwt.sign(
    { userId: this._id, sessionTokenId },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRATION
    }
  );
  this.sessionTokenId = await Hash.hashKey(sessionTokenId);
  await this.save();
  return token;
};

module.exports = mongoose.model("User", userSchema);
