import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const apartmenSchema = new Schema({
  number: {
    type: Number(),
  },
  entrance: {
    type: Number(),
  },
  services_debt: {
    type: Number(),
    default: 0,
  },
});

const buildingSchema = new Schema({
  address: {
    type: String(),
    lowercase: true,
  },
  apartments: [apartmenSchema],
});

const complexSchema = Schema({
  buildings: [buildingSchema],
});

complexSchema.post("save", handleSaveError);
complexSchema.pre("findOneAndUpdate", setUpdateSetting);
complexSchema.post("findOneAndUpdate", handleSaveError);

const Complex = model("residential_complex", complexSchema);

export default Complex;
