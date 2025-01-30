import News from "../models/News.js";

export async function makeNews(data) {
  return await News.create(data);
}

export function getNewsList(filter, query) {
  return News.find(filter, "", query).sort({ updateAt: -1 });
}

export function findNewsById(id) {
  return News.findById(id);
}

export function addReactionById(id, data) {
  return News.findByIdAndUpdate(id, data);
}

export function removeNewsById(id) {
  return News.findByIdAndDelete(id);
}
