import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const votingSchema = new Schema(
  {
    headline: {
      type: String,
      required: [true, "Headline is required"],
    },
    votingType: {
      type: String,
      enum: ["Single", "Multiple"],
      required: [true, "Choose the type of voting!"],
    },
    options: [optionSchema],

    startDate: {
      type: Date,
      required: [true, "Specify start date"],
    },
    endDate: {
      type: Date,
    },
    displayType: {
      type: String,
      enum: ["Percentages", "Number"],
      required: [true, "Make your choice!"],
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    votedUsers: [votedUserSchema],
  },
  { versionKey: false }
);

votingSchema.post("save", handleSaveError);
votingSchema.pre("findOneAndUpdate", setUpdateSetting);
votingSchema.post("findOneAndUpdate", handleSaveError);

const Voting = model("voting", votingSchema);

export default Voting;
