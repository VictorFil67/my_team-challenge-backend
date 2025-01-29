import News from "../models/News.js";

export async function makeNews(data) {
  return await News.create(data);
}

export function getNewsList(filter, query) {
  return News.find(filter, "", query).sort({ updateAt: -1 });
}
