import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";
// import { string } from "joi";

// const isLoggedIn = () => {
//   console.log(this.tokens)
//   return this.tokens.accessToken;
// };

const buildingSchema = new Schema({
  residential_complex: {
    type: String,
    trim: true,
    required: [true, "Residential complex is required"],
  },
  building: {
    type: String,
    lowercase: true,
    trim: true,
    reguired: [true, "Building is required"],
  },
  apartment: {
    type: Number,
    required: [true, "Apartment number is required"],
    // required: [isLoggedIn, "Apartment number is required"],
  },
  entrance: {
    type: Number,
    required: [true, "Entrance is required"],
    // required: [isLoggedIn, "Entrance is required"],
  },
  moderator: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new Schema(
  {
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
    buildings: [buildingSchema],
    tokens: {
      accessToken: {
        type: String,
        default: "",
      },
      refreshToken: {
        type: String,
        default: "",
      },
    },
    is_admin: { type: Boolean, default: false },
    tempCode: {
      type: String,
    },
    tempCodeTime: {
      type: String,
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSetting);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
