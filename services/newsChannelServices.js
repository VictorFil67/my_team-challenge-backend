import NewsChannel from "../models/NewsChannel.js";

export async function addNewsChannel(data) {
  return await NewsChannel.create(data);
}

export async function getNewsChannelsList(filter, query) {
  return await NewsChannel.find(filter, "", query).sort({ updatedAt: -1 });
}

export async function findNewsChannel(filter) {
  return await NewsChannel.findOne(filter);
}

export async function findNewsChannelById(id) {
  return await NewsChannel.findById(id);
}
