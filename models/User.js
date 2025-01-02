import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

// const buildingSchema = new Schema({
//   residential_complex: {
//     type: String,
//     trim: true,
//     required: [true, "Residential complex is required"],
//   },
//   building: {
//     type: String,
//     lowercase: true,
//     trim: true,
//     reguired: [true, "Building is required"],
//   },
//   apartment: {
//     type: Number,
//     required: [true, "Apartment number is required"],
//   },
//   entrance: {
//     type: Number,
//     required: [true, "Entrance is required"],
//   },
//   moderator: {
//     type: Boolean,
//     default: false,
//   },
//   approved: {
//     type: Boolean,
//     default: false,
//   },
// });
const apartmentSchema = new Schema({
  apartment: {
    type: Number,
    required: [true, "Apartment number is required"],
  },
  entrance: {
    type: Number,
    required: [true, "Entrance is required"],
  },
  approved: {
    type: Boolean,
    default: false,
  },
});
const addressSchema = new Schema({
  building_id: {
    type: Schema.Types.ObjectId,
    ref: "residential_complex",
  },
  building: {
    type: String,
    lowercase: true,
    trim: true,
    reguired: [true, "Building is required"],
  },
  apartments: [apartmentSchema],
});
const buildingSchema = new Schema({
  residential_complex_id: {
    type: Schema.Types.ObjectId,
    ref: "residential_complex",
  },
  moderator: {
    type: Boolean,
    default: false,
  },
  addresses: [addressSchema],
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
    avatar: { type: String },
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
