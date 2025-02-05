import { model, Schema } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const newsSchema = new Schema(
  {
    picture: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Type title"],
    },
    titleUA: {
      type: String,
      required: [true, "Type title"],
    },
    text: {
      type: String,
      required: [true, "Type text"],
    },
    textUA: {
      type: String,
      required: [true, "Type text"],
    },
    reactions: [
      {
        reaction: {
          type: String,
        },
        // userId: {
        //   type: Schema.Types.ObjectId,
        //   ref: "user",
        // },
        userIds: [
          {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
        ],
      },
    ],
    news_channel_id: {
      type: Schema.Types.ObjectId,
      ref: "news_channel",
    },
  },
  { versionKey: false, timestamps: true }
);

newsSchema.post("save", handleSaveError);
newsSchema.pre("findOneAndUpdate", setUpdateSetting);
newsSchema.post("findOneAndUpdate", handleSaveError);

const News = model("news", newsSchema);

export default News;
