import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks";

const ChatRoomShema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  picture: {
    type: String,
  },
  building_id: {
    tipe: Schema.Types.ObjectId,
    ref: "residential_complex",
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

ChatRoom.post("save", handleSaveError);
ChatRoom.pre("findOneAndUpdate", setUpdateSetting);
ChatRoom.post("findOneAndUpdate", handleSaveError);

const ChatRoom = model("chat_room", ChatRoomShema);
export default ChatRoom;
