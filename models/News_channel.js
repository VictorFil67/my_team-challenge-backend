import { model, Schema } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const news_channelSchema = new Schema(
  {
    picture: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Type title"],
    },
    complex_id: {
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

news_channelSchema.post("save", handleSaveError);
news_channelSchema.pre("findOneAndUpdate", setUpdateSetting);
news_channelSchema.post("findOneAndUpdate", handleSaveError);

const News_channel = model("news_channel", news_channelSchema);

export default News_channel;
