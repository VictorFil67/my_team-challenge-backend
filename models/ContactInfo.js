import { model, Schema } from "mongoose";

const createContactInfo = new Schema(
  {
    title: {
      type: String,
      required: [true, "Type title"],
    },
    titleUA: {
      type: String,
      required: [true, "Type title"],
    },
    description: {
      type: String,
      required: [true, "Type description"],
    },
    descriptionUA: {
      type: String,
      required: [true, "Type description"],
    },
    location: {
      type: String,
      //   required: [true, "Choose the type of notification!"],
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

createContactInfo.post("save", handleSaveError);
createContactInfo.pre("findOneAndUpdate", setUpdateSetting);
createContactInfo.post("findOneAndUpdate", handleSaveError);

const ContactInfo = model("contactInfo", createContactInfo);

export default ContactInfo;
