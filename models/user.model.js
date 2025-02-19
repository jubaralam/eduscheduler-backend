const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_no: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "instructor" },
  gender: { type: String, default: null },
  city: { type: String, default: null },
  highest_qualification: { type: String, default: null },
  preferred_language: { type: String, default: null },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
