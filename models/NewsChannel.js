import { model, Schema } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const newsChannelSchema = new Schema(
  {
    picture: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Type title"],
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
  { versionKey: false, timestamps: false }
);

newsChannelSchema.post("save", handleSaveError);
newsChannelSchema.pre("findOneAndUpdate", setUpdateSetting);
newsChannelSchema.post("findOneAndUpdate", handleSaveError);

const NewsChannel = model("news_channel", newsChannelSchema);

export default NewsChannel;
