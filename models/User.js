import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    minlength: [8, "Password mast have at least 8 characters"],
    required: [true, "Password is required"],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Phone is required"],
  },
  tokens: {
    assesToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
});

const User = model("user", userSchema);

export default User;
