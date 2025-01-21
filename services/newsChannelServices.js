import NewsChannel from "../models/NewsChannel.js";

export async function addNewsChannel(data) {
  return await NewsChannel.create(data);
}
