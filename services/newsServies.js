import News from "../models/News.js";

export async function makeNews(data) {
  return await News.create(data);
}
