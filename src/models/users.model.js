import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Veuillez fournir un prénom"],
      maxLength: 50,
      minLength: 3,
    },
    lastName: {
      type: String,
      required: [true, "Veuillez fournir un nom"],
      maxLength: 50,
      minLength: 3,
    },
    email: {
      type: String,
      required: [true, "Veuillez fournir un email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Veuillez fournir un email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Veuillez fournir un mot de passe"],
      minLength: 6,
    },
    role: {
      type: String,
      required: [true, "Veuillez fournir un rôle"],
      default: "user",
      minLength: 3,
    },
    birthDate: {
      type: Date,
      required: [true, "Veuillez fournir une date de naissance"],
    },
    address: {
      type: String,
      required: [true, "Veuillez fournir une adresse"],
    },
    postalCode: {
      type: String,
      required: [true, "Veuillez fournir un code postal"],
    },
    city: {
      type: String,
      required: [true, "Veuillez fournir une ville"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Veuillez fournir un numéro de téléphone"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.toJSON = function () {
  let userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { userID: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePasswords = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

export default model("User", UserSchema);
