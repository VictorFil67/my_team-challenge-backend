import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const ChatRoomShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    picture: {
      type: String,
      default: "",
    },
    building_id: {
      type: Schema.Types.ObjectId,
      ref: "residential_complex",
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { versionKey: false }
);

ChatRoomShema.post("save", handleSaveError);
ChatRoomShema.pre("findOneAndUpdate", setUpdateSetting);
ChatRoomShema.post("findOneAndUpdate", handleSaveError);

const ChatRoom = model("chat_room", ChatRoomShema);
export default ChatRoom;
