import ContactInfo from "../models/ContactInfo.js";

export async function makeContactInfo(data) {
  return await ContactInfo.create(data);
}
