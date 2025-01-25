import News from "../models/News.js";

export async function makenews(data) {
  return await News.create(data);
}
