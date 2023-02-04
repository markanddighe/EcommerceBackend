import mongoose from "mongoose";
var Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    cpassword: {
      type: String,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVarified: {
      type: Number,
      default: 1,
    },
  },
  { versionKey: false }
);

const User = mongoose.model("homeAuthManagement", userSchema);

export default User;
