import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const notificationSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Type text"],
    },
    type: {
      type: String,
      enum: ["events", "emergency"],
      required: [true, "Choose the type of notification!"],
    },
    residential_complex_id: {
      type: Schema.Types.ObjectId,
      ref: "residential_complex",
    },
    building_id: {
      type: Schema.Types.ObjectId,
      ref: "residential_complex",
    },
  },
  { versionKey: false, timestamps: true }
);

notificationSchema.post("save", handleSaveError);
notificationSchema.pre("findOneAndUpdate", setUpdateSetting);
notificationSchema.post("findOneAndUpdate", handleSaveError);

const Notification = model("notification", notificationSchema);

export default Notification;
